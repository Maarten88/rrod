using Orleans;
using System.Threading.Tasks;

namespace GrainInterfaces
{
    public interface ITokenGrain : IGrainWithStringKey
    {
        Task<AuthTokenState> Get();
        Task Create(AuthTokenState value);
        Task Revoke();
    }
}
