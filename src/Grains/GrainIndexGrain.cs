using GrainInterfaces;
using Orleans;
using Orleans.Providers;
using Orleans.Runtime;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Grains
{
    public class IndexGrainState
    {
        public GrainReference Grain { get; set; }
    }

    [StorageProvider(ProviderName = "Default")]
    public class GrainIndexGrain<TGrainType> : Grain<IndexGrainState>, IGrainIndexGrain<TGrainType> where TGrainType : class, IGrain
    {
        public Task Set(TGrainType grain)
        {
            this.State.Grain = grain as GrainReference;
            return this.WriteStateAsync();
        }

        public Task Delete()
        {
            this.DeactivateOnIdle();
            return this.ClearStateAsync();
        }

        public Task<TGrainType> Get()
        {
            return Task.FromResult(State.Grain?.Cast<TGrainType>());
        }
    }
}
