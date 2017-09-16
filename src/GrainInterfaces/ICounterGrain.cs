using Orleans;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Orleans.CodeGeneration;

namespace GrainInterfaces
{
    public class IncrementCounterAction: IAction
    { }

    public class DecrementCounterAction: IAction
    { }

    public class StartCounterAction : IAction
    { }

    public class CounterStartedAction : IAction
    { }

    public class StopCounterAction : IAction
    { }

    public class CounterStoppedAction : IAction
    { }

    public class SyncCounterStateAction : IAction
    {
        public CounterState CounterState { get; set; }
    }

    public class CounterState
    {
        public int Count { get; set; }
        public bool Started { get; set; }

        public CounterState()
        { }

        public CounterState(CounterState other)
        {
            if (other == null)
            {
                this.Count = 0;
                this.Started = false;
            }
            else
            {
                this.Count = other.Count;
                this.Started = other.Started;
            }
        }

        public static CounterState Reducer(CounterState state, IAction action)
        {
            switch (action)
            {
                case IncrementCounterAction a:
                    return new CounterState(state) { Count = (state?.Count ?? 0) + 1 };

                case DecrementCounterAction a:
                    return new CounterState(state) { Count = (state?.Count ?? 0) - 1 };

                case StartCounterAction a:
                    return new CounterState(state) { Started = true };

                case StopCounterAction a:
                    return new CounterState(state) { Started = false };

                case SyncCounterStateAction a:
                    return a.CounterState;

                default:
                    return state;
            }
        }
    }

    public interface ICounterGrain: IGrainWithGuidKey
    {
        Task IncrementCounter();
        Task DecrementCounter();
        Task StartCounterTimer();
        Task StopCounterTimer();
        Task<CounterState> GetState();
        Task Process(IAction action);
    }
}
