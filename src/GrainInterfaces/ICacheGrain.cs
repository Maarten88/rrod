using Orleans;
using System;
using System.Threading.Tasks;
using Orleans.Concurrency;

namespace GrainInterfaces
{
    public interface ICacheGrain<T> : IGrainWithStringKey
    {
        Task Set(Immutable<T> item, TimeSpan timeToKeep);
        Task<Immutable<T>> Get();
        Task Clear();
        Task Refresh();
    }
}
