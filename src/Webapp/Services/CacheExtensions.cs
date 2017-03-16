using System;
using Microsoft.Extensions.Caching.Distributed;
using Webapp.Services;

namespace Microsoft.Extensions.DependencyInjection
{
    public class OrleansCacheOptions
    {

    }

    /// <summary>
    /// Extension methods for setting up Redis distributed cache related services in an <see cref="IServiceCollection" />.
    /// </summary>
    public static class OrleansCacheServiceCollectionExtensions
    {
        /// <summary>
        /// Adds Orleans distributed caching services to the specified <see cref="IServiceCollection" />.
        /// </summary>
        /// <param name="services">The <see cref="IServiceCollection" /> to add services to.</param>
        /// <param name="setupAction">An <see cref="Action{OrleansCacheOptions}"/> to configure the provided
        /// <see cref="OrleansCacheOptions"/>.</param>
        /// <returns>The <see cref="IServiceCollection"/> so that additional calls can be chained.</returns>
        public static IServiceCollection AddOrleansCache(this IServiceCollection services, Action<OrleansCacheOptions> setupAction)
        {
            if (services == null)
            {
                throw new ArgumentNullException(nameof(services));
            }

            if (setupAction == null)
            {
                throw new ArgumentNullException(nameof(setupAction));
            }

            services.AddOptions();
            services.Configure(setupAction);
            services.Add(ServiceDescriptor.Singleton<IDistributedCache, OrleansCache>());

            return services;
        }

        public static IServiceCollection AddOrleansCache(this IServiceCollection services)
        {
            services.Add(ServiceDescriptor.Singleton<IDistributedCache, OrleansCache>());
            return services;
        }
    }
}