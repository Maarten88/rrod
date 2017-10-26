using System;
using Orleans.Runtime.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Configuration;
using Orleans.Runtime.Host;
using Grains;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using Orleans.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Grains.Redux;
using GrainInterfaces;

namespace OrleansHost
{
    class Program
    {
        static LoggerFactory loggerFactory = new LoggerFactory();

        static async Task Main(string[] args)
        {
            string environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Development";
            var builder = new ConfigurationBuilder()
                    .SetBasePath(Directory.GetCurrentDirectory())
                    .AddInMemoryCollection(new Dictionary<string, string> // add default settings, that will be overridden by commandline
                        {
                            {"Id", "OrleansHost"},
                            {"Version", "1.0.0"},
                            {"DeploymentId", "testdeploymentid"},
                        })
                    .AddCommandLine(args)
                    .AddJsonFile($"appconfig.json", optional: true)
                    .AddJsonFile($"appconfig.{environment}.json", optional: true)
                    .AddEnvironmentVariables("ASPNETCORE_");  // The CloudService will pass settings (such as) the connectionstring through environment variables

            if ("Development".Equals(environment) && builder.GetFileProvider().GetFileInfo("OrleansHost.csproj").Exists)
            {
                // For more details on using the user secret store see http://go.microsoft.com/fwlink/?LinkID=532709
                builder.AddUserSecrets<Program>();
            }

            var config = builder.Build();

            loggerFactory.AddConsole(config.GetSection("Logging"));
            loggerFactory.AddDebug();
            var logger = loggerFactory.CreateLogger<Program>();

            logger.LogWarning(string.Format($"Starting Orleans silo..."));

            ClusterConfiguration clusterConfig = ClusterConfiguration.LocalhostPrimarySilo();
            clusterConfig.Globals.DeploymentId = config["Id"];
            clusterConfig.Globals.DataConnectionString = config.GetConnectionString("DataConnectionString");
            clusterConfig.AddMemoryStorageProvider("Default");
            clusterConfig.AddMemoryStorageProvider("PubSubStore");
            clusterConfig.AddSimpleMessageStreamProvider("Default");
            string siloName = config["Id"];

            var host = new SiloHostBuilder()
                .UseConfiguration(clusterConfig)
                .ConfigureSiloName(siloName)
                .ConfigureServices(services =>
                {
                    services.AddOptions();
                    services.TryAdd(ServiceDescriptor.Singleton<ILoggerFactory, LoggerFactory>());
                    services.TryAdd(ServiceDescriptor.Singleton(typeof(ILogger<>), typeof(Logger<>)));
                    services.Configure<ConnectionStrings>(config.GetSection("ConnectionStrings"));
                    string reduxConnectionString = config.GetConnectionString("ReduxConnectionString");
                    services.AddSingleton(new ReduxTableStorage<CertState>(reduxConnectionString));
                    services.AddSingleton(new ReduxTableStorage<UserState>(reduxConnectionString));
                    services.AddSingleton(new ReduxTableStorage<CounterState>(reduxConnectionString));
                })
                .AddApplicationPart(typeof(CounterGrain).Assembly)
                .AddApplicationPartsFromReferences(typeof(CounterGrain).Assembly)
                .Build();

            try
            {
                await host.StartAsync();

                logger.LogInformation(string.Format($"Successfully started Orleans silo {siloName}"));
                Console.WriteLine($"Silo {siloName} is running. Press [enter] to stop...");
                Console.ReadLine();

                await host.StopAsync();
                logger.LogWarning(string.Format($"Orleans silo shutdown."));
            }
            catch (Exception e)
            {
                logger.LogCritical(e, "Silo stopping fatally with exception: " + e.Message);
            }
        }
    }
}