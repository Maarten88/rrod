using System;
using System.Collections.Generic;
using System.Collections.Immutable;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using GrainInterfaces;

namespace Grains.Redux
{
    public class ReduxGrainReducer<TState>
    {
        private Func<TState, IAction, TState> reducer;

        public ReduxGrainReducer(Func<TState, IAction, TState> reducer)
        {
            this.reducer = reducer;
        }

        public ReduxGrainState<TState> Execute(ReduxGrainState<TState> previous, IAction action)
        {
            var nextState = this.reducer(previous.State, action);
            var nextSerial = previous.Serial + 1;
            var next = new ReduxGrainState<TState>(nextState, nextSerial);
            next.UnsavedActions.Add(new TableStorableAction(DateTimeOffset.UtcNow, nextSerial, action));
            return next;
        }
    }
}
