using System;
using System.IO;
using System.Threading;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Orleans;
using Orleans.Runtime;
using Orleans.Runtime.Configuration;
using Microsoft.Extensions.Logging;
using System.Linq;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.AspNetCore.Builder;
using Webapp.Services;
using GrainInterfaces;
using Orleans.Concurrency;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using Microsoft.AspNetCore.ResponseCompression;
using System.IO.Compression;
using Microsoft.AspNetCore.SpaServices.Webpack;
using Webapp.Controllers;
using Webapp.Identity;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using Microsoft.AspNetCore.Identity;
using IdentityModel;
using System.IdentityModel.Tokens;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using System.Security.Claims;
using System.Net;

namespace Webapp
{
    public class Program
    {
        public static IConfigurationRoot Configuration;
        public static void Main(string[] args)
        {
            string environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Development";
            bool isDevelopment = "Development".Equals(environment, StringComparison.OrdinalIgnoreCase);

            var builder = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
                .AddJsonFile($"appsettings.{environment}.json", optional: true)
                .AddEnvironmentVariables();

            if (builder.GetFileProvider().GetFileInfo("Webapp.csproj").Exists)
            {
                builder.AddUserSecrets<Program>();
            }

            Configuration = builder.Build();

            // Initialize the connection to the OrleansHost process
            var orleansClientConfig = ClientConfiguration.LocalhostSilo();
            orleansClientConfig.DeploymentId = Configuration["DeploymentId"];
            orleansClientConfig.DataConnectionString = Configuration.GetConnectionString("DataConnectionString");
            orleansClientConfig.AddSimpleMessageStreamProvider("Default");
            orleansClientConfig.DefaultTraceLevel = Severity.Warning;
            orleansClientConfig.TraceFileName = "";

            IClusterClient orleansClient;
            do
            {
                orleansClient = new ClientBuilder().UseConfiguration(orleansClientConfig).Build();
                try
                {
                    orleansClient.Connect().Wait();
                    // GrainClient.Initialize(orleansClientConfig);
                }
                catch (Exception ex) when (ex is OrleansException || ex is SiloUnavailableException || (ex is AggregateException && ex.InnerException is SiloUnavailableException))
                {
                    orleansClient.Dispose();
                    // Wait for the Host to start
                    Thread.Sleep(3000);
                }
            }
            while (!orleansClient.IsInitialized);

            // we use a single settings file, that also contains the hosting settings
            var urls = (Configuration[WebHostDefaults.ServerUrlsKey] ?? "http://localhost:5000")
                .Split(new[] { ',', ';' })
                .Select(url => url.Trim())
                .ToArray();

            // find out if we run any secure urls
            var secureUrls = urls
                .Distinct()
                .Select(url => new Uri(url))
                .Where(uri => uri.Scheme == "https")
                .ToArray();


            // It is possible to request Acme certificates with subject alternative names, but this is not yet implemented.
            // Usually we'll need only a single address, so I'm taking the first one
            // string firstSecureHost = secureUrls.Any() ? secureUrls.First().Host : null;
            var listenUrls = urls
                .Distinct()
                .Where(url => url.StartsWith("http://"));

            // if so, start a listener to respond to Acme (Let's Encrypt) requests, using a response received via an Orleans Cache Grain
            string[] httpsDomains;
            IWebHost acmeHost;
            AcmeOptions acmeOptions;

            if (!secureUrls.Any())
            {
                httpsDomains = new string[] { };
                acmeOptions = null;
                acmeHost = null;
            }
            else
            {
                // Kestrel can only listen once to any given port, so we make sure multiple https addresses get only one listener
                var httpsListen = secureUrls.GroupBy(url => url.Port).Select(url => url.First()).Select(url => "https://*:" + url.Port);
                listenUrls = listenUrls.Union(httpsListen);
                httpsDomains = secureUrls.Select(url => url.Host).Distinct().ToArray();

                acmeOptions = new AcmeOptions
                {
                    DomainNames = httpsDomains,
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
                    .UseConfiguration(Configuration)
                    .ConfigureLogging((context, factory) =>
                    {
                        factory.AddConfiguration(context.Configuration.GetSection("Logging"));
                        factory.AddConsole();
                        factory.AddDebug();
                    })
                    .UseEnvironment(environment)
                    .ConfigureServices(services => {
                        services.AddSingleton<IClusterClient>(orleansClient);
                        services.Configure<AcmeSettings>(Configuration.GetSection(nameof(AcmeSettings)));

                        // Register a certitificate manager, supplying methods to store and retreive certificates and acme challenge responses
                        services.AddAcmeCertificateManager(acmeOptions);
                    })
                    .UseUrls("http://*:80/.well-known/acme-challenge/")
                    .UseKestrel()
                    // .UseLoggerFactory(loggerFactory)
                    .Configure(app => {
                        app.UseAcmeResponse();
                    })
                    .Build();

                
                try
                {
                    acmeHost.Start();
                }
                catch (Exception e)
                {
                    var logger = acmeHost.Services.GetService<ILogger<Program>>();
                    // var logger = loggerFactory.CreateLogger<Program>();
                    logger.LogError("Error: can't start web listener for acme certificate renewal, probably the web address is in use by another process. Exception message is: " + e.Message);
                    logger.LogError("Ignoring noncritical error (stop W3SVC or Skype to fix this), continuing...");
                }
            }

            var host = new WebHostBuilder()
                .UseConfiguration(Configuration)
                .ConfigureLogging((context, factory) =>
                {
                    factory.AddConfiguration(context.Configuration.GetSection("Logging"));
                    factory.AddConsole();
                    factory.AddDebug();
                })
                .ConfigureServices(services => {
                    services.AddSingleton<IClusterClient>(orleansClient);
                    if (secureUrls.Any())
                        services.AddAcmeCertificateManager(acmeOptions);
                })
                .UseContentRoot(Directory.GetCurrentDirectory())
                .UseEnvironment(environment)
                .UseUrls(listenUrls.ToArray())
                .UseSetting("baseUrl", urls.First())
                .UseStartup<Startup>()
                .UseKestrel(async options =>
                {
                    // TODO: Make this into a nice Kestrel.Https.Acme nuget package
                    if (secureUrls.Any())
                    {
                        // Request a new certificate with Let's Encrypt and store it for next time
                        var certificateManager = options.ApplicationServices.GetService<ICertificateManager>();
                        var certificate = await certificateManager.GetCertificate(httpsDomains);
                        if (certificate != null)
                        {
                            options.Listen(IPAddress.Loopback, 443, listenOptions =>
                            {
                                listenOptions.UseHttps(certificate);
                            });
                        }
                    }
                })
                .Build();

            host.Run();
        }
    }
}
