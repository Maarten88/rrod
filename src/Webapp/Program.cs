using GrainInterfaces;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
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
                .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
                .AddJsonFile($"appsettings.{environment}.json", optional: true)
                .AddDockerSecrets("/run/secrets", optional: true)
                .AddUserSecrets<Program>(optional: true)
                .AddEnvironmentVariables("RROD_")
                .Build();

            var loggerFactory = new LoggerFactory()
                .AddConsole(config.GetSection("Logging"))
                .AddDebug();
            var logger = loggerFactory.CreateLogger<Program>();
            logger.LogWarning($"Starting Webapp in {environment} environment...");

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
            IWebHost acmeHost;
            AcmeOptions acmeOptions;

            if (!hasHttps)
            {
                acmeOptions = null;
                acmeHost = null;
            }
            else
            {
                acmeOptions = new AcmeOptions
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

                acmeHost = new WebHostBuilder()
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
                    // .PreferHostingUrls(false)
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
                    acmeHost.Start();
                }
                catch (Exception e)
                {
                    logger.LogError("Error: can't start web listener for acme certificate renewal, probably the web address is in use by another process. Exception message is: " + e.Message);
                    logger.LogError("Ignoring noncritical error (stop W3SVC or Skype to fix this), continuing...");
                }
            }

            var webHost = new WebHostBuilder()
                // .UseConfiguration(config)
                .ConfigureServices(services =>
                {
                    services.AddSingleton<IConfiguration>(config);
                    services.AddSingleton<IClusterClient>(orleansClient);
                    services.AddSingleton<ILoggerFactory>(loggerFactory);
                    if (hasHttps)
                        services.AddAcmeCertificateManager(acmeOptions);
                })
                .UseContentRoot(Directory.GetCurrentDirectory())
                .UseEnvironment(environment)
                // .UseUrls(listenUrls.ToArray())
                .PreferHostingUrls(false)
                .UseStartup<Startup>()
                .UseKestrel(options =>
                {
                    var certificateManager = options.ApplicationServices.GetService<ICertificateManager>();

                    foreach (var endpoint in endpoints)
                    {
                        var endpointConfig = endpoint.Value;
                        var port = endpointConfig.Port ?? (endpointConfig.Scheme.Equals("https", StringComparison.InvariantCultureIgnoreCase) ? 443 : 80);

                        var ipAddresses = new List<IPAddress>();
                        var hosts = endpointConfig.Hosts ?? new List<string> { endpointConfig.Host };
                        foreach (var host in hosts)
                        {
                            if (host.Equals("localhost", StringComparison.InvariantCultureIgnoreCase))
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
                                ipAddresses.Add(IPAddress.IPv6Any);
                            }
                        }

                        foreach (var address in ipAddresses)
                        {
                            options.Listen(address, port, async listenOptions =>
                            {
                                if (endpointConfig.Scheme.Equals("https", StringComparison.InvariantCultureIgnoreCase))
                                {
                                    X509Certificate2 certificate = null;
                                    try
                                    {
                                        var domains = endpointConfig.Domains ?? new List<string> { endpointConfig.Domain };
                                        // Request a new certificate with Let's Encrypt and store it for next time
                                        certificate = await certificateManager.GetCertificate(domains.ToArray());
                                        listenOptions.UseHttps(certificate);
                                    }
                                    catch (Exception e)
                                    {
                                        logger.LogCritical($"Kestrel startup: Exception getting certificate. {e.Message}");
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