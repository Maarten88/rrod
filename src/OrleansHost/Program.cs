using System;
using Orleans.Runtime.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Configuration;
using Orleans.Runtime.Host;
using Grains;
using System.Collections.Generic;
using System.IO;

namespace OrleansHost
{
    class Program
    {
        static LoggerFactory loggerFactory = new LoggerFactory();

        static int Main(string[] args)
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

            ClusterConfiguration clusterConfig = ClusterConfiguration.LocalhostPrimarySilo();
            clusterConfig.Globals.DeploymentId = config["Id"];
            clusterConfig.Globals.DataConnectionString = config.GetConnectionString("DataConnectionString");
            clusterConfig.AddMemoryStorageProvider("Default");
            clusterConfig.AddMemoryStorageProvider("PubSubStore");
            clusterConfig.AddSimpleMessageStreamProvider("Default");
            clusterConfig.Defaults.DefaultTraceLevel = Orleans.Runtime.Severity.Warning;
            clusterConfig.Defaults.TraceFileName = "";
            clusterConfig.UseStartupType<Startup>();

            var siloHost = new SiloHost(config["Id"], clusterConfig);

            try
            {
                siloHost.InitializeOrleansSilo();
                bool ok = siloHost.StartOrleansSilo(catchExceptions: false);

                if (!ok)
                {
                    logger.LogError(string.Format($"Failed to start Orleans silo '{siloHost.Name}' as a {siloHost.Type} node."));
                    return 1;
                }
            }
            catch (Exception exc)
            {
                siloHost.ReportStartupError(exc);
                return 2;
            }

            Console.WriteLine("OrleansHost is running. Press [Ctrl]-C to stop...");
            siloHost.WaitForOrleansSiloShutdown();
            // logger.LogInformation(string.Format($"Orleans silo '{siloHost.Name}' shutdown. Press [Enter]"));
            // Console.ReadLine();
            return 0;
        }
    }
}