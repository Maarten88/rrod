using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;


namespace Webapp.Services
{
    public interface IAsyncInitializer
    {
        Task Run(CancellationToken cancelToken);
    }

    [JsonObject]
    class InitializerResult
    {
        [JsonIgnore]
        public Task Task { get; }
        public InitializerResult(string name, Task task)
        {
            Name = name;
            Task = task;
        }

        [JsonProperty]
        public string Name { get; }

        [JsonProperty]
        public string Status { get => this.Task.Status.ToString(); }

        [JsonProperty(DefaultValueHandling = DefaultValueHandling.Ignore)]
        public string ExceptionMessage { get => this.Task.Exception?.InnerException.Message; }
    }

    public enum ExceptionBehaviour
    {
        ContinueOnError,
        StopApplication
    }

    public class InitializationOptions
    {
        public PathString StatusPath { get; set; } = null;
        public ExceptionBehaviour ExceptionBehaviour { get; set; } = ExceptionBehaviour.StopApplication;
    }
}


namespace Microsoft.Extensions.DependencyInjection
{
    using Webapp.Services;
    using Microsoft.AspNetCore.Hosting;


    public static class AsyncInitializationExtensions
    {
        public static IServiceCollection AddAsyncInitialization(this IServiceCollection services)
        {
            services.AddOptions<InitializationOptions>();
            return services;
        }

        public static IServiceCollection AddAsyncInitialization(this IServiceCollection services, Action<InitializationOptions> setupAction)
        {
            services.AddOptions<InitializationOptions>().Configure(setupAction);
            return services;
        }

        public static IServiceCollection AddAsyncInitializer<TAsyncInitializer>(this IServiceCollection services) where TAsyncInitializer : class, IAsyncInitializer
        {
            return services.AddAsyncInitializer<TAsyncInitializer>(typeof(TAsyncInitializer).Name);
        }
        public static IServiceCollection AddAsyncInitializer<TAsyncInitializer>(this IServiceCollection services, string name) where TAsyncInitializer : class, IAsyncInitializer
        {
            services.AddSingleton<TAsyncInitializer>();
            services.AddSingleton(sp => new InitializerResult(name, sp.GetRequiredService<TAsyncInitializer>().Run(sp.GetService<IApplicationLifetime>()?.ApplicationStopping ?? CancellationToken.None)));
            return services;
        }

        public static IServiceCollection AddAsyncInitializer<TDependency>(this IServiceCollection services, string name, Func<TDependency, CancellationToken, Task> initializer)
        {
            services.AddSingleton(sp => new InitializerResult(name, initializer(sp.GetRequiredService<TDependency>(), sp.GetService<IApplicationLifetime>()?.ApplicationStopping ?? CancellationToken.None)));
            return services;
        }

        public static IServiceCollection AddAsyncInitializer(this IServiceCollection services, string name, Func<CancellationToken, Task> initializer)
        {
            services.AddSingleton(sp => new InitializerResult(name, initializer(sp.GetService<IApplicationLifetime>()?.ApplicationStopping ?? CancellationToken.None)));
            return services;
        }
    }
}

namespace Microsoft.AspNetCore.Builder
{
    using Webapp.Services;
    using Microsoft.AspNetCore.Hosting;
    using Microsoft.AspNetCore.Http;
    using Microsoft.Extensions.DependencyInjection;
    using Microsoft.Extensions.Logging;
    using Microsoft.Extensions.Options;

    class AsyncInitializationMiddleware
    {
        readonly RequestDelegate next;
        readonly IEnumerable<InitializerResult> results;
        readonly Task initializeTask;
        readonly InitializationOptions options;
        readonly ILogger logger;
        bool finished = false;

        public AsyncInitializationMiddleware(RequestDelegate next, IEnumerable<InitializerResult> results, IOptions<InitializationOptions> options, ILogger<AsyncInitializationMiddleware> logger)
        {
            this.next = next ?? throw new ArgumentException(nameof(next));
            this.results = results;
            this.initializeTask = Task.WhenAll(results.Select(result => result.Task));
            this.options = options.Value ?? throw new ArgumentException(nameof(options));
            this.logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                if (this.options.StatusPath.HasValue && context.Request.Path.Equals(this.options.StatusPath))
                {
                    await this.InitializationStatus(context);
                    return;
                }

                if (!this.finished)
                {
                    await this.initializeTask;
                    this.finished = true;
                }
            }
            catch (Exception e)
            {
                logger.LogError(e, "Exception during initialization");
                if (this.options.ExceptionBehaviour == ExceptionBehaviour.StopApplication)
                {
                    logger.LogCritical(e, "Fatal exception: stopping application...");
                    context.RequestServices.GetRequiredService<IApplicationLifetime>().StopApplication();
                    throw;
                }
                else
                {
                    logger.LogWarning("Ignoring initialization error, continuing execution");
                    this.finished = true;
                }
            }

            await this.next(context);
        }

        private async Task InitializationStatus(HttpContext context)
        {
            context.Response.StatusCode = (int)System.Net.HttpStatusCode.OK;
            context.Response.ContentType = "application/json";
            var message = JsonConvert.SerializeObject(this.results);
            await context.Response.WriteAsync(message);
        }
    }

    public static class ApplicationBuilderExtensions
    { 
        public static IApplicationBuilder UseAsyncInitialization(this IApplicationBuilder applicationBuilder) => applicationBuilder.UseMiddleware<AsyncInitializationMiddleware>();
    }
}
