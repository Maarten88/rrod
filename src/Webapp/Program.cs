using GrainInterfaces;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Orleans;
using Orleans.Concurrency;
using Orleans.Configuration;
using Orleans.Hosting;
using Orleans.Providers.Streams.AzureQueue;
using Orleans.Runtime;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Security.Cryptography.X509Certificates;
using System.Threading;
using System.Threading.Tasks;
using Webapp.Models;
using Webapp.Services;

namespace Webapp
{
    public class Program
    {
        private static readonly ManualResetEvent clientStopped = new ManualResetEvent(false);

        public static async Task Main(string[] args)
        {
            var environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Development";
            var isDevelopment = "Development".Equals(environment, StringComparison.OrdinalIgnoreCase);

            var config = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddInMemoryCollection(new Dictionary<string, string> // add default settings, that will be overridden by commandline
                {
                    {"Id", "Webapp"},
                    {"Version", "1.0.0"},
                    {"ClusterId", "rrod-cluster"},
                    {"ServiceId", "rrod"}
                })
                .AddCommandLine(args)
                .AddJsonFile("Webapp.settings.json", optional: true, reloadOnChange: true)
                .AddJsonFile($"Webapp.settings.{environment}.json", optional: true, reloadOnChange: true)
                .AddJsonFile("/run/config/Webapp.settings.json", optional: true, reloadOnChange: true)
                .AddDockerSecrets("/run/secrets", optional: true)
                .AddUserSecrets<Program>(optional: true)
                .AddEnvironmentVariables("RROD_")
                .Build();

            var loggerFactory = new LoggerFactory()
                .AddConsole(config.GetSection("Logging"))
                .AddDebug();
            var logger = loggerFactory.CreateLogger<Program>();
            logger.LogWarning($"Starting Webapp in {environment} environment...");

            foreach (var provider in config.Providers)
            {
                logger.LogInformation($"Config Provider {provider.GetType().Name}: {provider.GetChildKeys(Enumerable.Empty<string>(), null).Count()} settings");
            }

            // ServicePointManager.CheckCertificateRevocationList = false;
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls | SecurityProtocolType.Tls11 | SecurityProtocolType.Tls12;
            ServicePointManager.DefaultConnectionLimit = 20;

            int attempt = 0;
            int initializeAttemptsBeforeFailing = 7;
            IClusterClient clusterClient = null;
            while (true)
            {
                // Initialize orleans client
                clusterClient = new ClientBuilder()
                    .ConfigureServices((context, services) =>
                    {
                        // services.AddOptions();
                        services.AddSingleton<ILoggerFactory>(loggerFactory);
                        // services.AddSingleton<IConfiguration>(config);
                        services.Configure<ClusterOptions>(config);
                    })
                    .AddAzureQueueStreams<AzureQueueDataAdapterV2>("Default", builder => builder.Configure(options => options.ConnectionString = config.GetConnectionString("DataConnectionString")))
                    .ConfigureApplicationParts(parts =>
                    {
                        parts.AddApplicationPart(typeof(ICounterGrain).Assembly).WithReferences();
                        parts.AddApplicationPart(typeof(AzureQueueDataAdapterV2).Assembly).WithReferences();
                    })
                    .UseAzureStorageClustering(options => options.ConnectionString = config.GetConnectionString("DataConnectionString"))
                    .Build();

                try
                {
                    await clusterClient.Connect().ConfigureAwait(false);
                    logger.LogInformation("Client successfully connected to silo host");
                    break;
                }
                catch (OrleansException)
                {
                    attempt++;
                    logger.LogWarning($"Attempt {attempt} of {initializeAttemptsBeforeFailing} failed to initialize the Orleans client.");

                    if (clusterClient != null)
                    {
                        clusterClient.Dispose();
                        clusterClient = null;
                    }

                    if (attempt > initializeAttemptsBeforeFailing)
                    {
                        throw;
                    }

                    // Wait 4 seconds before retrying
                    await Task.Delay(TimeSpan.FromSeconds(4));
                }
            }

            var endpoints = config.GetSection("Http:Endpoints")
                    .GetChildren()
                    .ToDictionary(section => section.Key, section =>
                    {
                        var endpoint = new EndpointConfiguration();
                        section.Bind(endpoint);
                        return endpoint;
                    });

            // if so, start a listener to respond to Acme (Let's Encrypt) requests, using a response received via an Orleans Cache Grain
            var hasHttps = endpoints.Any(endpoint => endpoint.Value.Scheme.Equals("https", StringComparison.InvariantCultureIgnoreCase));
            var needPort80 = endpoints.Any(endpoint => (endpoint.Value.Port ?? (endpoint.Value.Scheme.Equals("https", StringComparison.InvariantCultureIgnoreCase) ? 443 : 80)) == 80);
            var certs = new Dictionary<string, X509Certificate2>();

            var acmeOptions = new AcmeOptions
            {
                AcmeSettings = config.GetSection(nameof(AcmeSettings)).Get<AcmeSettings>(),
                GetChallengeResponse = async (challenge) =>
                {
                    var cacheGrain = clusterClient.GetGrain<ICacheGrain<string>>(challenge);
                    var response = await cacheGrain.Get();
                    return response.Value;
                },
                SetChallengeResponse = async (challenge, response) =>
                {
                    var cacheGrain = clusterClient.GetGrain<ICacheGrain<string>>(challenge);
                    await cacheGrain.Set(new Immutable<string>(response), TimeSpan.FromHours(2));
                },
                StoreCertificate = async (string domainName, byte[] certData) =>
                {
                    var certGrain = clusterClient.GetGrain<ICertGrain>(domainName);
                    await certGrain.UpdateCertificate(certData);
                },
                RetrieveCertificate = async (domainName) =>
                {
                    var certGrain = clusterClient.GetGrain<ICertGrain>(domainName);
                    var certData = await certGrain.GetCertificate();
                    return certData.Value;
                }
            };

            if (hasHttps)
            {
                logger.LogWarning($"At least one https endpoint is present. Initialize Acme endpoint.");

                var acmeHost = new WebHostBuilder()
                    .UseEnvironment(environment)
                    .UseConfiguration(config)
                    .ConfigureServices(services =>
                    {
                        services.AddSingleton<IClusterClient>(clusterClient);
                        services.AddSingleton<ILoggerFactory>(loggerFactory);
                        services.Configure<AcmeSettings>(config.GetSection(nameof(AcmeSettings)));

                        // Register a certitificate manager, supplying methods to store and retreive certificates and acme challenge responses
                        services.AddAcmeCertificateManager(acmeOptions);
                    })
                    // .UseUrls("http://*:80")
                    .PreferHostingUrls(false)
                    .UseKestrel(options => {
                        options.Listen(IPAddress.Any, 80);
                    })
                    .Configure(app =>
                    {
                        app.UseAcmeResponse();
                    })
                    .Build();

                try
                {
                    await acmeHost.StartAsync().ConfigureAwait(false);
                }
                catch (Exception e)
                {
                    logger.LogError("Error: can't start web listener for acme certificate renewal, probably the web address is in use by another process. Exception message is: " + e.Message);
                    logger.LogError("Ignoring noncritical error (stop W3SVC or Skype to fix this), continuing...");
                }

                var certificateManager = acmeHost.Services.GetRequiredService<ICertificateManager>();
                // var certificateManager = new AcmeCertificateManager(Options.Create(acmeOptions));
                foreach (var endpoint in endpoints)
                {
                    var endpointConfig = endpoint.Value;
                    bool isHttpsEndpoint = endpointConfig.Scheme.Equals("https", StringComparison.InvariantCultureIgnoreCase);
                    var port = endpointConfig.Port ?? (isHttpsEndpoint ? 443 : 80);

                    X509Certificate2 certificate = null;
                    if (isHttpsEndpoint)
                    {
                        try
                        {
                            var domains = new List<string> { endpointConfig.Domain }
                                .Concat(endpointConfig.Domains)
                                .Where(ep => !string.IsNullOrEmpty(ep))
                                .Distinct()
                                .ToArray();

                            logger.LogInformation($"Getting certificate for domain {domains.First()} on port {port}");

                            // Request a new certificate with Let's Encrypt and store it for next time
                            try 
                            {
                                certificate = await certificateManager.GetCertificate(domains);
                            }
                            catch (Exception e)
                            {
                                logger.LogCritical(e, $"Exception getting certificate for domain {domains.First()}. PfxPassword configured incorrectly?");
                            }
                            if (certificate == null)
                            {
                                // It didn't work - create a temporary certificate so that we can still start with an untrusted certificate
                                logger.LogCritical($"Error getting certificate for domain {domains.First()} (endpoint '{endpoint.Key}'). Creating self-signed temporary certificate...");
                                certificate = CertHelper.BuildTlsSelfSignedServer(domains);
                            }
                            certs.Add(domains.First(), certificate);
                            logger.LogInformation($"Certificate for domain {domains.First()}: {certificate != null}");
                        }
                        catch (Exception e)
                        {
                            logger.LogCritical($"Kestrel startup: Exception getting certificate. {e.Message}");
                        }
                    }
                }
                if (needPort80)
                {
                    await acmeHost.StopAsync();
                }
            }

            var webHost = new WebHostBuilder()
                .UseEnvironment(environment)
                .UseConfiguration(config)
                .ConfigureServices(services =>
                {
                    // services.AddSingleton<IConfiguration>(config);
                    services.AddSingleton<IClusterClient>(clusterClient);
                    services.AddSingleton<ILoggerFactory>(loggerFactory);
                    services.Configure<AcmeSettings>(config.GetSection(nameof(AcmeSettings)));
                    services.AddAcmeCertificateManager(acmeOptions);
                })
                .UseContentRoot(Directory.GetCurrentDirectory())
                // .UseUrls(listenUrls.ToArray())
                .PreferHostingUrls(false)
                .Configure(app =>
                {
                    app.UseAcmeResponse();
                })
                .UseStartup<Startup>()
                .UseKestrel(options =>
                {
                    foreach (var endpoint in endpoints)
                    {
                        var endpointConfig = endpoint.Value;
                        bool isHttpsEndpoint = endpointConfig.Scheme.Equals("https", StringComparison.InvariantCultureIgnoreCase);
                        var port = endpointConfig.Port ?? (isHttpsEndpoint ? 443 : 80);

                        var ipAddresses = new List<IPAddress>();
                        var hosts = new List<string> { endpointConfig.Host }
                            .Concat(endpointConfig.Hosts)
                            .Where(ep => !string.IsNullOrEmpty(ep))
                            .Distinct();

                        foreach (var host in hosts)
                        {
                            if (host == "localhost")
                            {
                                ipAddresses.Add(IPAddress.IPv6Loopback);
                                ipAddresses.Add(IPAddress.Loopback);
                            }
                            else if (IPAddress.TryParse(host, out var address))
                            {
                                ipAddresses.Add(address);
                            }
                            else
                            {
                                logger.LogError($"Error parsing endpoint host: {host}");
                            }
                        }

                        foreach (var address in ipAddresses)
                        {
                            options.Listen(address, port, listenOptions =>
                            {
                                if (isHttpsEndpoint)
                                {
                                    var domains = new List<string> { endpointConfig.Domain }
                                        .Concat(endpointConfig.Domains)
                                        .Where(ep => !string.IsNullOrEmpty(ep))
                                        .Distinct()
                                        .ToArray();
                                    
                                    if (certs.TryGetValue(domains.First(), out var certificate))
                                    {
                                        logger.LogInformation($"Kestrel config: Listen on address {address.ToString()}:{port}, certificate {(certificate == null ? "NULL" : certificate.Subject.ToString())}");
                                        listenOptions.UseHttps(certificate);
                                        listenOptions.NoDelay = false;
                                        // listenOptions.UseConnectionLogging();
                                    }
                                    else
                                    {
                                        logger.LogError($"No certificate for domain: {domains.First()}");
                                    }
                                }
                            });
                        }
                    }
                })
                .Build();

            await webHost.RunAsync();
        }
    }
}