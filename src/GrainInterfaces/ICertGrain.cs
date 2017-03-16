using System.Threading.Tasks;
using Orleans;
using Orleans.Concurrency;

namespace GrainInterfaces
{
    public interface ICertGrain : IGrainWithStringKey
    {
        Task<Immutable<byte[]>> GetCertificate();
        Task UpdateCertificate(byte[] certData);
    }
}
