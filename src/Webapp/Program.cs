using GrainInterfaces;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Orleans;
using Orleans.Concurrency;
using Orleans.Runtime;
using Orleans.Runtime.Configuration;
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
                logger.LogInformation($"Config Provider {provider.GetType().Name}: {provider.GetChildKeys(Enumerable.Empty<string>(), null).Count()} top-level items");
            }

            // Initialize the connection to the OrleansHost process
            var orleansClientConfig = new ClientConfiguration
            {
                ClusterId = config["ClusterId"],
                GatewayProvider = ClientConfiguration.GatewayProviderType.AzureTable,
                DataConnectionString = config.GetConnectionString("DataConnectionString"),
                PropagateActivityId = true
            };
            // orleansClientConfig.AddSimpleMessageStreamProvider("Default");
            orleansClientConfig.AddAzureQueueStreamProviderV2("Default", config.GetConnectionString("DataConnectionString"), clusterId: config["ClusterId"]);

            var attempt = 0;
            IClusterClient orleansClient;
            while (true)
            {
                orleansClient = new ClientBuilder()
                    .UseConfiguration(orleansClientConfig)
                    .ConfigureApplicationParts(parts => parts.AddApplicationPart(typeof(ICounterGrain).Assembly).WithReferences())
                    .Build();
                try
                {
                    await orleansClient.Connect().ConfigureAwait(false);
                    logger.LogInformation("Client successfully connected to silo host");
                    break;
                }
                catch (Exception ex) when (ex is OrleansException || ex is SiloUnavailableException || (ex is AggregateException && ex.InnerException is SiloUnavailableException))
                {
                    orleansClient.Dispose();

                    attempt++;
                    logger.LogWarning($"Attempt {attempt} of 8 failed to initialize the Orleans client.");
                    if (attempt > 7)
                    {
                        throw;
                    }
                    // Wait 4 seconds before retrying
                    await Task.Delay(4000);
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

            if (hasHttps)
            {
                logger.LogWarning($"At least one https endpoint is present. Initialize Acme endpoint.");
                var acmeOptions = new AcmeOptions
                {
                    GetChallengeResponse = async (challenge) =>
                    {
                        var cacheGrain = orleansClient.GetGrain<ICacheGrain<string>>(challenge);
                        var response = await cacheGrain.Get();
                        return response.Value;
                    },
                    SetChallengeResponse = async (challenge, response) =>
                    {
                        var cacheGrain = orleansClient.GetGrain<ICacheGrain<string>>(challenge);
                        await cacheGrain.Set(new Immutable<string>(response), TimeSpan.FromHours(2));
                    },
                    StoreCertificate = async (string domainName, byte[] certData) =>
                    {
                        var certGrain = orleansClient.GetGrain<ICertGrain>(domainName);
                        await certGrain.UpdateCertificate(certData);
                    },
                    RetrieveCertificate = async (domainName) =>
                    {
                        var certGrain = orleansClient.GetGrain<ICertGrain>(domainName);
                        var certData = await certGrain.GetCertificate();
                        return certData.Value;
                    }
                };

                var acmeHost = new WebHostBuilder()
                    // .UseConfiguration(config)
                    .ConfigureLogging((context, factory) =>
                    {
                        factory.AddConfiguration(context.Configuration.GetSection("Logging"));
                        factory.AddConsole();
                        factory.AddDebug();
                    })
                    .UseEnvironment(environment)
                    .ConfigureServices(services =>
                    {
                        services.AddSingleton<IClusterClient>(orleansClient);
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
                    // .UseLoggerFactory(loggerFactory)
                    .Configure(app =>
                    {
                        app.UseAcmeResponse();
                    })
                    .Build();

                try
                {
                    await acmeHost.StartAsync();
                }
                catch (Exception e)
                {
                    logger.LogError("Error: can't start web listener for acme certificate renewal, probably the web address is in use by another process. Exception message is: " + e.Message);
                    logger.LogError("Ignoring noncritical error (stop W3SVC or Skype to fix this), continuing...");
                }

                var certificateManager = new AcmeCertificateManager(Options.Create(acmeOptions));
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
                            certificate = await certificateManager.GetCertificate(domains);
                            if (certificate == null)
                            {
                                // It didn't work - create a temporary certificate so that we can still start with an untrusted certificate
                                logger.LogCritical($"Error getting certificate for domain {domains.First()} (endpoint '{endpoint.Key}')");
                                // var certificateAuthorityCertificate = CertBuilder.CreateCertificateAuthorityCertificate("RrodCA", out var tmpCaPrivateKey);
                                // certificate = CertBuilder.CreateSelfSignedCertificateBasedOnCertificateAuthorityPrivateKey(domains.First(), certificateAuthorityCertificate.Subject, tmpCaPrivateKey);
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
                // .UseConfiguration(config)
                .ConfigureServices(services =>
                {
                    services.AddSingleton<IConfiguration>(config);
                    services.AddSingleton<IClusterClient>(orleansClient);
                    services.AddSingleton<ILoggerFactory>(loggerFactory);
                })
                .UseContentRoot(Directory.GetCurrentDirectory())
                .UseEnvironment(environment)
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

            webHost.Run();
        }
    }
}