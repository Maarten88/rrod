using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using GrainInterfaces;
using Microsoft.AspNetCore.Mvc;
using Orleans;
using Webapp.Models;
using Microsoft.AspNetCore.Antiforgery;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Webapp.Identity;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.SpaServices.Prerendering;
using Webapp.Helpers;
using Microsoft.AspNetCore.Hosting;

namespace Webapp.Controllers
{
    public static class Constants
    {
        public const string SessionCookieName = "SESSION";
        public const string AntiForgeryCookieName = "XSRF-TOKEN"; // send the xsrftoken in a readable cookie for the client to read and send back in a header against the second unreadable cookie
    }


    // The home controller generates the initial home page, as wel as the aspnet-javascript serverside fallback pages (mostly for seo)
    public class HomeController : Controller
    {
        readonly IAntiforgery antiForgery;
        readonly Guid sessionId;
        readonly IServiceProvider serviceProvider;
        readonly ILogger logger;
        readonly IClusterClient clusterClient;
        readonly ISpaPrerenderer spaPrerenderer;
        readonly IHostingEnvironment env;

        public HomeController(IAntiforgery antiForgery, IHttpContextAccessor httpContextAccessor, ISpaPrerenderer spaPrerenderer, IServiceProvider serviceProvider, IClusterClient clusterClient, IHostingEnvironment env, ILoggerFactory loggerFactory) : base()
        {
            // this.cookie = cookie;
            this.antiForgery = antiForgery;
            this.serviceProvider = serviceProvider;
            this.clusterClient = clusterClient;
            this.spaPrerenderer = spaPrerenderer;
            this.env = env;
            this.logger = loggerFactory.CreateLogger<HomeController>();

            string sessionCookie = httpContextAccessor.HttpContext.Request.Cookies[Constants.SessionCookieName];
            if (string.IsNullOrEmpty(sessionCookie) || !Guid.TryParse(sessionCookie, out this.sessionId))
            {
                this.sessionId = Guid.NewGuid();
                httpContextAccessor.HttpContext.Response.Cookies.Append(Constants.SessionCookieName, this.sessionId.ToString(), new CookieOptions { Expires = DateTimeOffset.UtcNow + TimeSpan.FromDays(180), HttpOnly = false, Secure = httpContextAccessor.HttpContext.Request.IsHttps });
            }
        }

        public async Task<ActionResult> Index()
        {
            var tokens = this.antiForgery.GetAndStoreTokens(this.HttpContext);

            UserModel userModel;

            if (this.User.Identity.IsAuthenticated)
            {
                var userManager = this.serviceProvider.GetRequiredService<UserManager<ApplicationUser>>();
                var user = await userManager.GetUserAsync(this.User);
                userModel = new UserModel
                {
                    IsAuthenticated = true,
                    UserId = user.UserId,
                    Email = user.Email,
                    FirstName = user.PersonalData?.FirstName,
                    LastName = user.PersonalData?.LastName
                };
            }
            else
            {
                userModel = new UserModel
                {
                    IsAuthenticated = false
                };
            }

            dynamic data = new { sessionId = this.sessionId, xsrfToken = tokens.RequestToken, isAuthenticated = this.User.Identity.IsAuthenticated, userModel = userModel };
            var renderResult = await this.spaPrerenderer.RenderToString("ClientApp/dist/main-server", null, data, 30000);
            if (!string.IsNullOrEmpty(renderResult.RedirectUrl))
            {
                if (renderResult.StatusCode != null && renderResult.StatusCode.Value == 301)
                {
                    return RedirectPermanent(renderResult.RedirectUrl);
                }
                return Redirect(renderResult.RedirectUrl);
            }
            if (renderResult.StatusCode != null)
            {
                this.HttpContext.Response.StatusCode = renderResult.StatusCode.Value;
            }

            return View("Index", renderResult);
        }

        // Used after login/logout
        [HttpGet, Route("~/xsrfrefresh")]
        [ProducesResponseType(typeof(ApiModel<XsrfModel>), 200)]
        [ProducesResponseType(typeof(ApiModel<XsrfModel>), 400)]
        public ActionResult XsrfRefresh()
        {
            var tokens = this.antiForgery.GetAndStoreTokens(this.HttpContext);
            if (string.IsNullOrWhiteSpace(tokens.RequestToken))
                return BadRequest(ApiModel.AsError(new XsrfModel { XsrfToken = null }, "Error getting XSRF token"));

            return Ok(ApiModel.AsSuccess(new XsrfModel { XsrfToken = tokens.RequestToken }));
        }


        public IActionResult Error()
        {
            return View();
        }


        [HttpPost("~/subscribe")]
        [ProducesResponseType(typeof(ApiModel<SubscribeModel>), 200)]
        [ProducesResponseType(typeof(ApiModel<SubscribeModel>), 400)]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Subscribe([FromForm] SubscribeModel model)
        {
            // this.ValidateCsrfToken();
            if (!this.ModelState.IsValid)
                return BadRequest(this.ModelState.AsApiModel(model));

            try
            {
                var emailGrain = this.clusterClient.GetGrain<IEmailGrain>(0);
                await emailGrain.SendEmail(
                    new Email
                    {
                        To = new List<string> { "rrod@example.com" },
                        MessageBody = $"<p>Keep me informed: {model.Email}</p>",
                        Subject = $"Subscriber request: {model.Email}",
                    });

                return Ok(ApiModel.AsSuccess(model, "Registered!"));
            }
            catch (Exception e)
            {
                this.logger.LogError(e, $"An Exception of type {e.GetType().ToString()}: \"{e.Message}\" occurred in /subscribe.\r\n{e.StackTrace}");
                return StatusCode(StatusCodes.Status500InternalServerError, ApiModel.FromException(model, e, includeExceptions: this.env.IsDevelopment()));
            }
        }

        /// <summary>
        /// Contact form handler. Takes Form imput and returns a redirect on sucess, to make it work without javascript
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPost("~/contact")]
        [ProducesResponseType(typeof(ApiModel<ContactModel>), 302)]
        [ProducesResponseType(typeof(ApiModel<ContactModel>), 400)]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Contact([FromForm] ContactModel model)
        {
            if (!this.ModelState.IsValid) // it should be possible to do a complete server render of form including the error...
                return BadRequest(this.ModelState.AsApiModel(model));

            try
            {
                var message = $"<h2>Contact request: {model.FirstName} {model.LastName}</h2><p>Name: {model.FirstName} {model.LastName}</p><p>Email: {model.Email}</p><p>Phone: {model.Phone}</p><p>Message: {model.Message}</p>";
                var emailGrain = this.clusterClient.GetGrain<IEmailGrain>(0);
                await emailGrain.SendEmail(
                    new Email
                    {
                        To = new List<string> { "rrod@example.com" },
                        MessageBody = message,
                        Subject = $"Contact request: {model.Email}",
                    });

                return Ok(ApiModel.AsSuccess<ContactModel>(model, "Message received"));
            }
            catch (Exception e)
            {
                this.logger.LogError(e, $"An Exception of type {e.GetType().ToString()}: \"{e.Message}\" occurred in /subscribe.\r\n{e.StackTrace}");
                return StatusCode(StatusCodes.Status500InternalServerError, ApiModel.FromException(model, e, includeExceptions: this.env.IsDevelopment()));
            }
        }
    }
}
