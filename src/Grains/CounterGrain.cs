using GrainInterfaces;
using Orleans;
using System;
using System.Threading.Tasks;
using Grains.Redux;
using System.Reactive.Linq;
using Orleans.Streams;
using Microsoft.Extensions.Logging;

namespace Grains
{
    [ImplicitStreamSubscription("ActionsFromClient")]
    public class CounterGrain : ReduxGrain<CounterState>, ICounterGrain
    {
        IDisposable timer = null;
        StreamSubscriptionHandle<IAction> actionStreamSubscription;
        IDisposable storeSubscription;
        IAsyncStream<IAction> actionsToClientStream;
        readonly ILogger<CounterGrain> logger;

        public CounterGrain(ReduxTableStorage<CounterState> storage, ILoggerFactory loggerFactory) : base(CounterState.Reducer, storage, loggerFactory)
        {
            this.logger = loggerFactory.CreateLogger<CounterGrain>();
        }


        public override async Task OnActivateAsync()
        {
            // Do this first, it initializes the Store!
            await base.OnActivateAsync();

            var streamProvider = this.GetStreamProvider("Default");
            var actionsFromClientStream = streamProvider.GetStream<IAction>(this.GetPrimaryKey(), "ActionsFromClient");
            // Subscribe to Actions streamed from the client, and process them.
            // These actions can't be directly dispatched, they need to be interpreted and can cause other actions to be dispatched
            actionStreamSubscription = await actionsFromClientStream.SubscribeAsync(async (action, st) => {
                await this.Process(action);
            });

            this.actionsToClientStream = streamProvider.GetStream<IAction>(this.GetPrimaryKey(), "ActionsToClient");

            // Subscribe to state updates as they happen on the server, and publish them using the SyncCounterState action
            this.storeSubscription = this.Store.Subscribe(
                async (CounterState state) => {
                    if (state != null)
                        await this.actionsToClientStream.OnNextAsync(new SyncCounterStateAction { CounterState = state });
                },
                (Exception e) => {
                    this.logger.LogError(e, "CounterGrain: Exception in store subscription stream");
                });

            var loadedState = await this.GetState();
            if (loadedState != null && loadedState.Started)
            {
                this.StartCounterTimerInternal();
            }
        }

        public override async Task OnDeactivateAsync()
        {
            this.logger.LogWarning($"Countergrain {this.GetPrimaryKeyString()} stopping...");
            // clean up when grain goes away (nobody is looking at us anymore)
            this.storeSubscription.Dispose();
            this.storeSubscription = null;
            await this.actionStreamSubscription.UnsubscribeAsync();
            this.actionStreamSubscription = null;
            await base.OnDeactivateAsync();
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


        void StartCounterTimerInternal()
        {
            if (this.timer != null)
                throw new Exception("Can't start: already started");

            this.timer = this.RegisterTimer(async (state) => {
                var action = new IncrementCounterAction();
                // This sends the action to the clients for processing there
                await this.actionsToClientStream.OnNextAsync(action);

                // This processes the action here on the server, and also sends the syncstate to make sure the outcome is the same
                // The order of events is important here
                await this.Dispatch(action);
                await this.WriteStateAsync();
            }, null, TimeSpan.FromSeconds(3), TimeSpan.FromSeconds(3));
        }

        public async Task StartCounterTimer()
        {
            StartCounterTimerInternal();

            await this.Dispatch(new StartCounterAction());
            await this.actionsToClientStream.OnNextAsync(new CounterStartedAction());
            await this.WriteStateAsync();
        }

        void StopTimerInternal()
        {
            if (this.timer == null)
                throw new Exception("Can't stop: not started");

            this.timer.Dispose();
            this.timer = null;
        }

        public async Task StopCounterTimer()
        {
            StopTimerInternal();
            await this.Dispatch(new StopCounterAction());
            await this.actionsToClientStream.OnNextAsync(new CounterStoppedAction());
            await this.WriteStateAsync();
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
