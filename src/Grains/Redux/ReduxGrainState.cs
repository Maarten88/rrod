using Orleans;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Grains.Redux
{
    public class ReduxGrainState<TState>
    {
        public List<TableStorableAction> UnsavedActions { get; private set; }

        public TState State { get; set; }

        public uint Serial { get; set; }

        public ReduxGrainState()
        {
            this.UnsavedActions = new List<TableStorableAction>();
        }

        public ReduxGrainState(TState initialState, uint initialSerial) : this()
        {
            this.State = initialState;
            this.Serial = initialSerial;
        }
    }
}
