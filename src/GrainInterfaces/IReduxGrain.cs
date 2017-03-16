using System.Threading.Tasks;

namespace GrainInterfaces
{
    public interface IAction
    {
    }
    

    public interface IReduxGrain<TState> 
    {
        Task<TState> GetState();
        Task<IAction> Dispatch(IAction action);
    }
}
