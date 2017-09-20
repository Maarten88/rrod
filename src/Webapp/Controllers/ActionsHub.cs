using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using Orleans;
using GrainInterfaces;
using Orleans.Streams;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using Microsoft.AspNetCore.Http;

namespace Webapp
{
    public class ActionsHub : Hub
    {
        private readonly ILogger<ActionsHub> logger;
        private readonly IClusterClient grainClient;
        private readonly Guid sessionId;

        public ActionsHub(IClusterClient grainClient, ITempDataProvider cookie, IHttpContextAccessor httpContextAccessor, ILogger<ActionsHub> logger)
        {
            this.grainClient = grainClient;
            this.logger = logger;

            var data = cookie.LoadTempData(httpContextAccessor.HttpContext);
            if (data.TryGetValue("session", out object id) && (id is Guid))
            {
                this.sessionId = (Guid)id;
            }
            else
            {
                // generate a new session id
                data["session"] = this.sessionId = Guid.NewGuid();
                cookie.SaveTempData(httpContextAccessor.HttpContext, data);
            }
        }

        public override async Task OnConnectedAsync()
        {
            var client = this.Clients.Client(this.Context.ConnectionId);
            this.logger.LogInformation($"connection {this.Context.ConnectionId} opened by {this.Context.User.Identity.Name}");
            var streamProvider = this.grainClient.GetStreamProvider("Default");
            var actionsStream = streamProvider.GetStream<IAction>(this.sessionId, "ActionsToClient");
            var actionsSubscription = await actionsStream.SubscribeAsync(
                // subscribe to the stream of actions coming from grains that need to go to the client
                async (action, st) => {
                    // Cast it to Redux Javascript format. The ActionName method is mirrored in the Typewriter Redux template, so typescript knows the same string constants
                    dynamic jsAction = new { type = action.GetType().Name, payload = action };
                    await client.InvokeAsync("action", jsAction);
                });

            // We add the subscription to the connection context metadata - this is the easiest way 
            // to keep it so we can unsubscribe from orleans when the javascript client disconnects
            this.Context.Connection.Metadata.Add("actionsSubscription", actionsSubscription);
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            if (exception != null)
                this.logger.LogInformation($"connection {this.Context.ConnectionId} disconnected with exception {exception.Message}");
            else
                this.logger.LogInformation($"connection {this.Context.ConnectionId} disconnected itself");

            if (this.Context.Connection.Metadata.TryGetValue("actionsSubscription", out object subscription))
            {
                await ((StreamSubscriptionHandle<IAction>)subscription).UnsubscribeAsync();
                this.Context.Connection.Metadata.Remove("actionsSubscription");
            }
        }
    }
}