using GrainInterfaces;
using Grains;
using Grains.Redux;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.Extensions.Logging;
using Orleans;
using Orleans.Hosting;
using Orleans.Runtime.Configuration;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Threading.Tasks;

namespace OrleansHost
{
    internal class Program
    {
        private static readonly LoggerFactory LoggerFactory = new LoggerFactory();

        private static async Task Main(string[] args)
        {
            var environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Development";
            var builder = new ConfigurationBuilder()
                    .SetBasePath(Directory.GetCurrentDirectory())
                    .AddInMemoryCollection(new Dictionary<string, string> // add default settings, that will be overridden by commandline
                        {
                            {"Id", "OrleansHost"},
                            {"Version", "1.0.0"},
                            {"DeploymentId", "testdeploymentid"},
                        })
                    .AddCommandLine(args)
                    .AddJsonFile("appconfig.json", optional: true)
                    .AddJsonFile($"appconfig.{environment}.json", optional: true)
                    .AddEnvironmentVariables("ASPNETCORE_");  // The CloudService will pass settings (such as) the connectionstring through environment variables

            if ("Development".Equals(environment) && builder.GetFileProvider().GetFileInfo("OrleansHost.csproj").Exists)
            {
                // For more details on using the user secret store see http://go.microsoft.com/fwlink/?LinkID=532709
                builder.AddUserSecrets<Program>();
            }

            var config = builder.Build();

            LoggerFactory.AddConsole(config.GetSection("Logging"));
            LoggerFactory.AddDebug();
            var logger = LoggerFactory.CreateLogger<Program>();

            logger.LogWarning("Starting Orleans silo...");

            // https://dotnet.github.io/orleans/Documentation/Advanced-Concepts/Docker-Deployment.html
            var clusterConfig = new ClusterConfiguration();

            clusterConfig.Globals.ClusterId = config["Id"];
            clusterConfig.Globals.DataConnectionString = config.GetConnectionString("DataConnectionString");
            clusterConfig.Globals.LivenessType = GlobalConfiguration.LivenessProviderType.AzureTable;
            clusterConfig.Globals.ReminderServiceType = GlobalConfiguration.ReminderServiceProviderType.AzureTable;

            clusterConfig.Defaults.PropagateActivityId = true;
            clusterConfig.Defaults.ProxyGatewayEndpoint = new IPEndPoint(IPAddress.Any, 10400);
            clusterConfig.Defaults.Port = 10300;
            var ips = Dns.GetHostAddressesAsync(Dns.GetHostName()).Result;
            clusterConfig.Defaults.HostNameOrIPAddress = ips.Where(ip => ip.AddressFamily == System.Net.Sockets.AddressFamily.InterNetwork).FirstOrDefault()?.ToString();

            clusterConfig.AddMemoryStorageProvider("Default");
            clusterConfig.AddMemoryStorageProvider("PubSubStore");
            clusterConfig.AddSimpleMessageStreamProvider("Default");
            var siloName = config["Id"];

            var host = new SiloHostBuilder()
                .UseConfiguration(clusterConfig)
                .ConfigureSiloName(siloName)
                .ConfigureServices(services =>
                {
                    services.AddOptions();
                    services.TryAdd(ServiceDescriptor.Singleton<ILoggerFactory, LoggerFactory>());
                    services.TryAdd(ServiceDescriptor.Singleton(typeof(ILogger<>), typeof(Logger<>)));
                    services.Configure<ConnectionStrings>(config.GetSection("ConnectionStrings"));
                    var reduxConnectionString = config.GetConnectionString("ReduxConnectionString");
                    services.AddSingleton(new ReduxTableStorage<CertState>(reduxConnectionString));
                    services.AddSingleton(new ReduxTableStorage<UserState>(reduxConnectionString));
                    services.AddSingleton(new ReduxTableStorage<CounterState>(reduxConnectionString));
                })
                .ConfigureApplicationParts(parts => parts.AddApplicationPart(typeof(CounterGrain).Assembly).WithReferences())
                .Build();

            try
            {
                await host.StartAsync();

                logger.LogInformation(string.Format($"Successfully started Orleans silo {siloName}"));
                Console.WriteLine($"Silo {siloName} is running. Press [enter] to stop...");
                Console.ReadLine();

                await host.StopAsync();
                logger.LogWarning("Orleans silo shutdown.");
            }
            catch (Exception e)
            {
                logger.LogCritical(e, "Silo stopping fatally with exception: " + e.Message);
            }
        }
    }
}