using GrainInterfaces;
using Orleans;
using System;
using System.Threading.Tasks;
using Grains.Redux;
using System.Reactive.Linq;
using Orleans.Streams;

namespace Grains
{
    [ImplicitStreamSubscription("ActionsFromClient")]
    public class CounterGrain : ReduxGrain<CounterState>, ICounterGrain
    {
        IDisposable timer = null;
        IStreamProvider streamProvider;
        StreamSubscriptionHandle<IAction> actionStreamSubscription;
        IDisposable storeSubscription;

        public override async Task OnActivateAsync()
        {
            // Publish all user state updates to a stream that other grains can subscribe to
            this.streamProvider = this.GetStreamProvider("Default");
            var counterStateStream = this.streamProvider.GetStream<CounterState>(this.GetPrimaryKey(), "CounterState");
            this.storeSubscription = this.Store.Subscribe(async (CounterState state) => {
                await counterStateStream.OnNextAsync(state);
            });

            // Subscribe to Actions streamed from the client, and handle them.
            // These actions can't be directly dispatched, they need to be interpreted and can cause new actions to be dispatched
            var actionStream = streamProvider.GetStream<IAction>(this.GetPrimaryKey(), "ActionsFromClient");
            actionStreamSubscription = await actionStream.SubscribeAsync(async (action, st) => {
                await this.Process(action);
            });
            await base.OnActivateAsync();
        }
        public CounterGrain(ReduxTableStorage<CounterState> storage) : base(CounterState.Reducer, storage)
        {
        }

        public async Task IncrementCounter()
        {
            await this.Dispatch(new IncrementCounterAction());
            await this.WriteStateAsync();
        }

        public async Task DecrementCounter()
        {
            await this.Dispatch(new DecrementCounterAction());
            await this.WriteStateAsync();
        }

        public async Task StartCounterTimer()
        {
            if (this.timer != null)
                throw new Exception("Can't start: already started");

            await this.Dispatch(new StartCounterAction());

            var stream = this.streamProvider.GetStream<IAction>(this.GetPrimaryKey(), "ActionsToClient");
            this.timer = this.RegisterTimer(async (state) => {
                var action = new IncrementCounterAction();
                await this.Dispatch(action);
                await this.WriteStateAsync();
                await stream.OnNextAsync(action);
            }, null, TimeSpan.Zero, TimeSpan.FromSeconds(30));

            await stream.OnNextAsync(new CounterStartedAction());
        }

        public async Task StopCounterTimer()
        {
            if (this.timer == null)
                throw new Exception("Can't stop: not started");

            await this.Dispatch(new StopCounterAction());

            this.timer.Dispose();
            this.timer = null;
            var stream = this.streamProvider.GetStream<IAction>(this.GetPrimaryKey(), "ActionsToClient");
            await stream.OnNextAsync(new CounterStoppedAction());
        }

        public async Task Process(IAction action)
        {
            switch (action)
            {
                case IncrementCounterAction a:
                    await this.IncrementCounter();
                    break;
                case DecrementCounterAction a:
                    await this.DecrementCounter();
                    break;
                case StartCounterAction a:
                    await this.StartCounterTimer();
                    break;
                case StopCounterAction a:
                    await this.StopCounterTimer();
                    break;
                default:
                    throw new ArgumentException("Unknown Action received!");
            }
        }
    }
}
