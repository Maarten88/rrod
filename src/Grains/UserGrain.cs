using GrainInterfaces;
using Orleans;
using System;
using System.Threading.Tasks;
using Grains.Redux;
using System.Reactive.Linq;
using Orleans.Streams;
using Grains.Utility;
using Microsoft.Extensions.Logging;

namespace Grains
{
    public class UserGrain : ReduxGrain<UserState>, IUserGrain
    {
        IStreamProvider streamProvider;
        IDisposable storeSubscription;
        StreamSubscriptionHandle<IAction> actionStreamSubscription;

        public UserGrain(ReduxTableStorage<UserState> storage, ILoggerFactory loggerFactory) : base(UserState.Reducer, storage, loggerFactory)
        {
        }

        public override async Task OnActivateAsync()
        {
            await base.OnActivateAsync();

            // Publish all user state updates to a stream that other grains can subscribe to
            this.streamProvider = this.GetStreamProvider("Default");
            Guid userGuid = GuidUtility.Create(GuidUtility.UrlNamespace, this.GetPrimaryKeyString());
            var userStateStream = this.streamProvider.GetStream<UserState>(userGuid, "UserState");
            this.storeSubscription = this.Store.Subscribe(async (UserState state) => {
                await userStateStream.OnNextAsync(state);
            });

            // Subscribe to Actions streamed from the client, and handle them.
            // These actions can't be directly dispatched, they need to be interpreted and can cause new actions to be dispatched
            var actionStream = streamProvider.GetStream<IAction>(userGuid, "ActionsFromClient");
            actionStreamSubscription = await actionStream.SubscribeAsync(async (action, st) => {
                await this.Dispatch(action);
            });
        }



        public Task Dispatch(IAction action, bool delaySave = false)
        {
            base.Dispatch(action);
            if (delaySave)
                return Task.CompletedTask;
            else
                return this.WriteStateAsync();
        }

        public Task<UserState> GetUserState()
        {
            return Task.FromResult(Store.State);
        }
    }
}
