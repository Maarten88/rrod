using System;
using System.Collections.Generic;
using System.Linq;
using System.Reactive.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Grains.Redux
{
    public class ReduxGrainStore<TState> : Store<ReduxGrainState<TState>>, IStore<TState>
    {
        public ReduxGrainStore(Reducer<TState> reducer, TState initialState = default(TState), uint initialSerial = 0, params Middleware<TState>[] middlewares)
            : base(new ReduxGrainReducer<TState>((s, a) => reducer(s, a)).Execute, new ReduxGrainState<TState>(initialState, initialSerial))
        {
        }

        public ReduxGrainStore(Reducer<TState> reducer, ReduxGrainState<TState> initialState, params Middleware<TState>[] middlewares)
            : base(new ReduxGrainReducer<TState>((s, a) => reducer(s, a)).Execute, initialState)
        { }


        public TState State { get { return this.GetState().State; } }

        public IDisposable Subscribe(IObserver<TState> observer)
        {
            return ((IObservable<ReduxGrainState<TState>>)this)
                .Select(state => (TState)state.State)
                .DistinctUntilChanged()
                .Subscribe(observer);
        }

        TState IStore<TState>.GetState()
        {
            return ((IStore<TState>)this).GetState();
        }
    }
}
