using System;
using System.Threading.Tasks;
using GrainInterfaces;
using Grains.Redux;
using Orleans.Concurrency;
using Microsoft.Extensions.Options;
using Microsoft.Extensions.Logging;

namespace Grains
{
    public class CertState
    {
        public byte[] RawData { get; set; }

        public static CertState Reducer(CertState previous, IAction action)
        {
            var next = previous ?? new CertState();
            if (action is CertUpdate)
            {
                return new CertState { RawData = ((CertUpdate)action).RawData };
            }
            return next;
        }
    }

    public class CertUpdate : IAction
    {
        public byte[] RawData { get; set; }
    }

    public class CertGrain : ReduxGrain<CertState>, ICertGrain
    {
        readonly ILogger<CertGrain> logger;

        public CertGrain(ReduxTableStorage<CertState> storage, ILogger<CertGrain> logger) : base(CertState.Reducer, storage)
        {
            this.logger = logger;
        }

        public Task<Immutable<byte[]>> GetCertificate()
        {
            return Task.FromResult(new Immutable<byte[]>(this.Store.State?.RawData));
        }

        public Task UpdateCertificate(byte[] certData)
        {
            this.Dispatch(new CertUpdate { RawData = certData });
            return this.WriteStateAsync();
        }
    }
        
}
