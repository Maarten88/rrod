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
        private StreamSubscriptionHandle<IAction> actionsSubscription;
        private readonly Guid sessionId;
        private readonly IHubContext<ActionsHub> hubContext;

        public ActionsHub(IHubContext<ActionsHub> hubContext, IClusterClient grainClient, ITempDataProvider cookie, IHttpContextAccessor httpContextAccessor, ILogger<ActionsHub> logger)
        {
            this.grainClient = grainClient;
            this.logger = logger;
            this.hubContext = hubContext;

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
            Guid streamId = new Guid(); // TODO connect this

            this.logger.LogInformation($"connection {this.Context.ConnectionId} opened by {this.Context.User.Identity.Name}");
            var streamProvider = this.grainClient.GetStreamProvider("Default");
            var actionsStream = streamProvider.GetStream<IAction>(this.sessionId, "ActionsToClient");
            this.actionsSubscription = await actionsStream.SubscribeAsync(
                // subscribe to the stream of actions coming from grains that need to go to the client
                async (action, st) => {
                    // Cast it to Redux Javascript format. The ActionName method is mirrored in the Typewriter Redux template, so typescript knows the same string constants
                    dynamic message = new { type = action.GetType().Name, payload = action };

                    await this.hubContext.Clients.Client(this.Context.ConnectionId).InvokeAsync("action", action);
                    // await Action(message);
                });
        }

        public override Task OnDisconnectedAsync(Exception exception)
        {
            if (exception != null)
                this.logger.LogInformation($"connection {this.Context.ConnectionId} disconnected with exception {exception.Message}");
            else
                this.logger.LogInformation($"connection {this.Context.ConnectionId} disconnected itself");

            return Task.CompletedTask;
        }

        public async Task Action(dynamic action)
        {
            await this.Clients.Client(this.Context.ConnectionId).InvokeAsync("action", action);
        }
    }
}