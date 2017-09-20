using System;
using System.Net.WebSockets;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Orleans;
using Orleans.Streams;
using GrainInterfaces;
using Newtonsoft.Json;
using System.Collections.Concurrent;
using System.Threading;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using Microsoft.Extensions.Logging;

namespace Webapp.Controllers
{
    public interface IWebSocketHandler
    {
        Task OnConnected(WebSocket socket, Guid id);
        Task ReceiveAsync(WebSocket socket, WebSocketReceiveResult result, byte[] buffer);
        Task OnDisconnected(WebSocket socket);
    }

    static class ActionHelper
    {
        public static IAction ConstructTypedAction(dynamic action)
        {
            if (action == null || action.type == null)
                return null;

            // TODO: action.type should not be trusted as it is external input; it should be validated
            // Our actions are always defined inside GrainInterfaces for now
            Type actionType = Type.GetType("GrainInterfaces." + action.type + ",GrainInterfaces");

            if (action.payload == null)
                return Activator.CreateInstance(actionType) as IAction;
            else
                return (IAction)Convert.ChangeType(action.payload, actionType);
        }

        public static string ActionName(string className)
        {
            StringBuilder sb = new StringBuilder();

            string name = className.Substring(0, className.Length - 6); // remove 'Action'
            bool first = true;
            foreach (char c in name)
            {
                if (Char.IsUpper(c) && !first)
                {
                    sb.Append("_");
                }
                sb.Append(Char.ToUpper(c));
                if (first) first = false;
            }
            return sb.ToString();
        }
    }

    public class ActionsController : Controller
    {
        private readonly Guid sessionId;
        private readonly IClusterClient grainClient;

        public ActionsController(IClusterClient grainClient, ITempDataProvider cookie, IHttpContextAccessor httpContextAccessor): base()
        {
            this.grainClient = grainClient;
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

        [HttpGet("~/counterstate")]
        public async Task<CounterState> CounterState(Guid id)
        {
            var grain = this.grainClient.GetGrain<ICounterGrain>(id);
            var state = (await grain.GetState()) ?? new CounterState();
            return state;
        }

        [HttpPost("~/action")]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Action([FromBody] dynamic actionData)
        {
            var action = ActionHelper.ConstructTypedAction(actionData);
            if (action != null)
            {
                // We can send the action directly, or send it via a stream
                var grain = this.grainClient.GetGrain<ICounterGrain>(this.sessionId);
                await grain.Process(action);
                return Ok();
            }
            else
            {
                return BadRequest(ApiModel.AsError("invalid action"));
            }
        }

        [HttpPost("~/startcounter")]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> StartCounter()
        {
            var grain = this.grainClient.GetGrain<ICounterGrain>(this.sessionId);
            await grain.StartCounterTimer();
            return Ok();
        }

        [HttpPost("~/stopcounter")]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> StopCounter()
        {
            var grain = this.grainClient.GetGrain<ICounterGrain>(this.sessionId);
            await grain.StopCounterTimer();
            return Ok();
        }

        [HttpPost("~/incrementcounter")]
        public async Task<ActionResult> IncrementCounter()
        {
            var grain = this.grainClient.GetGrain<ICounterGrain>(this.sessionId);
            await grain.IncrementCounter();
            return Ok();
        }

        [HttpPost("~/decrementcounter")]
        public async Task<ActionResult> DecrementCounter()
        {
            var grain = this.grainClient.GetGrain<ICounterGrain>(this.sessionId);
            await grain.DecrementCounter();
            return Ok();
        }
    }

    public class ActionsHandler: IWebSocketHandler
    {
        private readonly ConcurrentDictionary<WebSocket, StreamSubscriptionHandle<IAction>> socketSubscriptions = new ConcurrentDictionary<WebSocket, StreamSubscriptionHandle<IAction>>();

        public async Task SendMessageAsync(WebSocket socket, string message)
        {
            if (socket.State != WebSocketState.Open)
                return;

            await socket.SendAsync(buffer: new ArraySegment<byte>(array: Encoding.ASCII.GetBytes(message),
                                                                  offset: 0,
                                                                  count: message.Length),
                                   messageType: WebSocketMessageType.Text,
                                   endOfMessage: true,
                                   cancellationToken: CancellationToken.None);
        }

        public async Task OnConnected(WebSocket socket, Guid id)
        {
            var streamProvider = GrainClient.GetStreamProvider("Default");
            var actionsStream = streamProvider.GetStream<IAction>(id, "ActionsToClient");
            var actionsSubscription = await actionsStream.SubscribeAsync(
                // subscribe to the stream of actions coming from grains that need to go to the client
                async (action, st) => {
                    // Cast it to Redux Javascript format. The ActionName method is mirrored in the Typewriter Redux template, so typescript knows the same string constants
                    dynamic message = new { type = action.GetType().Name, payload = action };
                    await SendMessageAsync(socket, JsonConvert.SerializeObject(message));
                });

            this.socketSubscriptions[socket] = actionsSubscription;
            //if (!this.socketSubscriptions.TryAdd(socket, streamSubscription))
            //    throw new Exception("Can't add subscription!");
        }

        public async Task ReceiveAsync(WebSocket socket, WebSocketReceiveResult result, byte[] buffer)
        {
            var id = this.socketSubscriptions[socket].StreamIdentity.Guid;
            var streamProvider = GrainClient.GetStreamProvider("Default");
            var stream = streamProvider.GetStream<IAction>(id, "ActionsFromClient");
            var message = Encoding.UTF8.GetString(buffer, 0, result.Count);
            var actionData = JsonConvert.DeserializeObject<dynamic>(message);
            IAction action = ActionHelper.ConstructTypedAction(actionData);
            if (action != null)
                await stream.OnNextAsync(action);
        }

        public async Task OnDisconnected(WebSocket socket)
        {
            if (this.socketSubscriptions.TryRemove(socket, out var subscription))
            {
                await subscription.UnsubscribeAsync();
            }
        }
    }


    public class WebSocketHandlerMiddleware
    {
        private readonly RequestDelegate next;
        readonly IWebSocketHandler webSocketHandler;
        readonly ITempDataProvider cookie;
        readonly ILogger<WebSocketHandlerMiddleware> logger;

        public WebSocketHandlerMiddleware(RequestDelegate next,
                                          IWebSocketHandler webSocketHandler, 
                                          ITempDataProvider cookie,
                                          ILogger<WebSocketHandlerMiddleware> logger)
        {
            this.next = next;
            this.webSocketHandler = webSocketHandler;
            this.cookie = cookie;
            this.logger = logger;
        }

        public async Task Invoke(HttpContext context)
        {
            if (!context.WebSockets.IsWebSocketRequest)
            {
                this.logger.LogWarning("Error: need a websocket request to open this path");
                return;
            }

            var data = this.cookie.LoadTempData(context);
            Guid sessionId;
            if (data.TryGetValue("session", out object id) && (id is Guid))
            {
                sessionId = (Guid)id;
            }
            else
            {
                this.logger.LogError("Error: tried to open websocket without a valid session cookie");
                return;
            }

            var socket = await context.WebSockets.AcceptWebSocketAsync();
            await this.webSocketHandler.OnConnected(socket, sessionId);
            await Receive(socket, async (result, buffer) =>
            {
                if (result.MessageType == WebSocketMessageType.Text)
                {
                    await this.webSocketHandler.ReceiveAsync(socket, result, buffer);
                    return;
                }

                else if (result.MessageType == WebSocketMessageType.Close)
                {
                    await this.webSocketHandler.OnDisconnected(socket);
                    return;
                }

            });
            //TODO - investigate the Kestrel exception thrown when this is the last middleware
            //await _next.Invoke(context);
        }

        private async Task Receive(WebSocket socket, Action<WebSocketReceiveResult, byte[]> handleMessage)
        {
            var buffer = new byte[1024 * 4];

            while (socket.State == WebSocketState.Open)
            {
                var result = await socket.ReceiveAsync(buffer: new ArraySegment<byte>(buffer),
                                                       cancellationToken: CancellationToken.None);

                handleMessage(result, buffer);
            }
        }
    }

}