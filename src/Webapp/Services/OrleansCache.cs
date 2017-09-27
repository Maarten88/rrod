using GrainInterfaces;
using Microsoft.Extensions.Caching.Distributed;
using Orleans;
using Orleans.Concurrency;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace Webapp.Services
{
    public class OrleansCache : IDistributedCache
    {
        readonly IClusterClient grainClient;
        public OrleansCache(IClusterClient grainClient)
        {
            this.grainClient = grainClient;
        }
        public byte[] Get(string key) => this.GetAsync(key).Result;

        public async Task<byte[]> GetAsync(string key, CancellationToken token = default(CancellationToken)) => (await this.grainClient.GetGrain<ICacheGrain<byte[]>>(key).Get()).Value;

        public void Refresh(string key) => this.RefreshAsync(key).Wait();

        public Task RefreshAsync(string key, CancellationToken token = default(CancellationToken)) => this.grainClient.GetGrain<ICacheGrain<byte[]>>(key).Refresh();

        public void Remove(string key) => this.RefreshAsync(key).Wait();

        public Task RemoveAsync(string key, CancellationToken token = default(CancellationToken)) => this.grainClient.GetGrain<ICacheGrain<byte[]>>(key).Clear();

        public void Set(string key, byte[] value, DistributedCacheEntryOptions options) => this.SetAsync(key, value, options).Wait();

        public Task SetAsync(string key, byte[] value, DistributedCacheEntryOptions options, CancellationToken token = default(CancellationToken))
        {
            var creationTime = DateTimeOffset.UtcNow;
            var absoluteExpiration = GetAbsoluteExpiration(creationTime, options);
            var expirationSeconds = GetExpirationInSeconds(creationTime, absoluteExpiration, options);
            return this.grainClient.GetGrain<ICacheGrain<byte[]>>(key).Set(new Immutable<byte[]>(value), TimeSpan.FromSeconds((double)(expirationSeconds ?? 0)));
        }

        private static long? GetExpirationInSeconds(DateTimeOffset creationTime, DateTimeOffset? absoluteExpiration, DistributedCacheEntryOptions options)
        {
            if (absoluteExpiration.HasValue && options.SlidingExpiration.HasValue)
            {
                return (long)Math.Min(
                    (absoluteExpiration.Value - creationTime).TotalSeconds,
                    options.SlidingExpiration.Value.TotalSeconds);
            }
            else if (absoluteExpiration.HasValue)
            {
                return (long)(absoluteExpiration.Value - creationTime).TotalSeconds;
            }
            else if (options.SlidingExpiration.HasValue)
            {
                return (long)options.SlidingExpiration.Value.TotalSeconds;
            }
            return null;
        }

        private static DateTimeOffset? GetAbsoluteExpiration(DateTimeOffset creationTime, DistributedCacheEntryOptions options)
        {
            if (options.AbsoluteExpiration.HasValue && options.AbsoluteExpiration <= creationTime)
            {
                throw new ArgumentOutOfRangeException(
                    nameof(DistributedCacheEntryOptions.AbsoluteExpiration),
                    options.AbsoluteExpiration.Value,
                    "The absolute expiration value must be in the future.");
            }
            var absoluteExpiration = options.AbsoluteExpiration;
            if (options.AbsoluteExpirationRelativeToNow.HasValue)
            {
                absoluteExpiration = creationTime + options.AbsoluteExpirationRelativeToNow;
            }

            return absoluteExpiration;
        }
    }
}
