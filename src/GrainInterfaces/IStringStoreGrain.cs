using System.Collections.Generic;
using System.Threading.Tasks;
using System.Xml.Linq;
using Orleans;
using Orleans.Concurrency;

namespace GrainInterfaces
{
    public interface IStringStoreGrain : IGrainWithStringKey
    {
        Task<string[]> GetAllStrings();
        Task StoreString(string element);
    }
}
