using Orleans;
using System.Threading.Tasks;

namespace GrainInterfaces
{
    // Creates a separate index item for each grain.Use for large collections. Grain Id is the name of the individual item.
    public interface IGrainIndexGrain<TGrainType> : IGrainWithStringKey where TGrainType : IGrain
    {
        Task Set(TGrainType grain);
        Task<TGrainType> Get();
        Task Delete();
    }

    // Creates a single index item for the index. Grain Id is the name of the index
    public interface IGrainDictionaryGrain<TGrainType> : IGrainWithStringKey where TGrainType : IGrain
    {
        Task Add(TGrainType grain, string key);
        Task Remove(string key);
        Task<TGrainType> Get(string key);
    }
}
