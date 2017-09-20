using GrainInterfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using Orleans;
using System;
using System.Threading.Tasks;
using Webapp.Services;

namespace Webapp.Controllers
{
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

        // This is another, more generic, way to send actions from the client to the server
        // This is unused; the pattern is more clear when commands directly call the API
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
}