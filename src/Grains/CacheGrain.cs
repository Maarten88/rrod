using System;
using System.Threading.Tasks;
using Orleans;
using GrainInterfaces;
using Orleans.Concurrency;

namespace Grains
{
    public class CacheGrain<T>: Grain, ICacheGrain<T>
    {
        Immutable<T> item = new Immutable<T>(default(T));
        TimeSpan timeToKeep = TimeSpan.Zero;

        public Task Set(Immutable<T> item, TimeSpan timeToKeep)
        {
            this.item = item;
            this.timeToKeep = timeToKeep == TimeSpan.Zero ? TimeSpan.FromHours(2) : timeToKeep;
            this.DelayDeactivation(timeToKeep);
            return Task.FromResult(0);
        }
        public Task<Immutable<T>> Get()
        {
            return Task.FromResult(this.item);
        }

        public Task Clear()
        {
            this.DeactivateOnIdle();
            return Task.FromResult(0);
        }

        public Task Refresh()
        {
            this.DelayDeactivation(timeToKeep);
            return Task.FromResult(0);
        }
    }
}
