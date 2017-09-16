using System;
using System.IO;
using System.Linq;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Grains.Redux;
using Microsoft.Extensions.DependencyInjection.Extensions;
using GrainInterfaces;

namespace Grains
{
    public class Startup
    {
        public IConfiguration Configuration { get; }

        public Startup()
        {
            string environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Development";

            var builder = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appconfig.json", optional: true, reloadOnChange: true)
                .AddJsonFile($"appconfig.{environment.ToLowerInvariant()}.json", optional: true)
                .AddEnvironmentVariables("ASPNETCORE_")
                .AddCommandLine(Environment.GetCommandLineArgs().Skip(1).ToArray());

            if ("Development".Equals(environment, StringComparison.OrdinalIgnoreCase) && builder.GetFileProvider().GetFileInfo("OrleansHost.csproj").Exists)
            {
                // For more details on using the user secret store see http://go.microsoft.com/fwlink/?LinkID=532709
                builder.AddUserSecrets<Startup>();
            }

            Configuration = builder.Build();
        }

        // This method gets called by the runtime. Use this method to add services to the container.
        public IServiceProvider ConfigureServices(IServiceCollection services)
        {
            services.TryAdd(ServiceDescriptor.Singleton<ILoggerFactory, LoggerFactory>());
            services.TryAdd(ServiceDescriptor.Singleton(typeof(ILogger<>), typeof(Logger<>)));

            services.AddOptions();
            services.Configure<ConnectionStrings>(Configuration.GetSection("ConnectionStrings"));
            // services.Configure<AcmeSettings>(Configuration.GetSection("AcmeSettings"));

            string reduxConnectionString = Configuration.GetConnectionString("ReduxConnectionString");
            services.AddSingleton(new ReduxTableStorage<CertState>(reduxConnectionString));
            services.AddSingleton(new ReduxTableStorage<UserState>(reduxConnectionString));
            services.AddSingleton(new ReduxTableStorage<CounterState>(reduxConnectionString));

            return services.BuildServiceProvider();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(ILoggerFactory loggerFactory)
        {
            loggerFactory.AddConsole(Configuration.GetSection("Logging"));
            loggerFactory.AddDebug();
        }
    }
}
