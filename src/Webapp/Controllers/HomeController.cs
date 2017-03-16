using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GrainInterfaces;
using Microsoft.AspNetCore.Mvc;
using Orleans;
using Webapp.Models;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using Microsoft.AspNetCore.Antiforgery;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Webapp.Identity;
using Microsoft.Extensions.DependencyInjection;
using Webapp.Account;
using IdentityServer4.Services;
using IdentityServer4.Models;
using IdentityServer4.Configuration;
using IdentityServer4.Validation;
using System.Security.Claims;
using Microsoft.Extensions.Logging;
using IdentityModel;
using IdentityServer4.Extensions;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Http.Authentication;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;

namespace Webapp.Controllers
{
    // The home controller generates the initial home page, as wel as the aspnet-javascript serverside fallback pages (mostly for seo)
    public class HomeController : Controller
    {
        // readonly ITempDataProvider cookie;
        readonly IAntiforgery antiForgery;
        readonly Guid sessionId;
        readonly IServiceProvider serviceProvider;
        readonly ILoggerFactory loggerFactory;

        public HomeController(ITempDataProvider cookie, IAntiforgery antiForgery, IHttpContextAccessor httpContextAccessor, IServiceProvider serviceProvider, ILoggerFactory loggerFactory) : base()
        {
            // this.cookie = cookie;
            this.antiForgery = antiForgery;
            this.serviceProvider = serviceProvider;
            this.loggerFactory = loggerFactory;

            // Create session id in an client-unreadable cookie
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

        public async Task<ActionResult> Index()
        {
            var tokens = this.antiForgery.GetAndStoreTokens(this.HttpContext);
            // Render this token in a div, so our javascript can read it and send it, and send it in the ajax request header where it can be validated against the XSRF-TOKEN cookie
            this.ViewBag.AntiForgeryRequestToken = tokens.RequestToken;
            this.ViewBag.SessionId = this.sessionId;

            UserModel userModel;
            // var userManager = this.serviceProvider.GetService<UserManager<ApplicationUser>>();
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

                var client = Config.GetClients().Where(c => c.ClientId == "Webapp").FirstOrDefault();

                var claims = new List<Claim>();
                // client claims
                claims.Add(new Claim(JwtClaimTypes.ClientId, client.ClientId));
                claims.AddRange(client.AllowedScopes.Select(name => new Claim(JwtClaimTypes.Scope, name)));

                // subject claims
                claims.Add(new Claim(JwtClaimTypes.Subject, user.UserId));
                claims.Add(new Claim(JwtClaimTypes.AuthenticationTime, DateTime.UtcNow.ToEpochTime().ToString(), ClaimValueTypes.Integer)); // DateTime.UtcNow.ToEpochTime().ToString()
                claims.Add(new Claim(JwtClaimTypes.IdentityProvider, this.User.GetIdentityProvider()));

                var issuer = this.HttpContext.GetIdentityServerIssuerUri();
                var token = new Token(OidcConstants.TokenTypes.AccessToken)
                {
                    Audiences = { issuer }, // .EnsureTrailingSlash()
                    Issuer = issuer,
                    Lifetime = client.AccessTokenLifetime,
                    Claims = claims.Distinct(new ClaimComparer()).ToList(),
                    ClientId = client.ClientId,
                    AccessTokenType = client.AccessTokenType
                };

                ITokenService tokenService = this.serviceProvider.GetRequiredService<ITokenService>();
                var securityToken = await tokenService.CreateSecurityTokenAsync(token);
                ViewBag.AccessToken = securityToken;
            }
            else
            {
                userModel = new UserModel
                {
                    IsAuthenticated = false
                };
            }

            this.ViewBag.UserModel = userModel;
            return View();
        }

        public IActionResult Error()
        {
            return View();
        }


        [HttpPost("~/subscribe")]
        public async Task<ActionResult> Subscribe([FromForm] SubscribeModel model)
        {
            // this.ValidateCsrfToken();
            if (!this.ModelState.IsValid)
            {
                return BadRequest(new FormResponse { Message = string.Join(", ", this.ModelState.Values.SelectMany(v => v.Errors).Select(error => error.ErrorMessage)), Result = this.ModelState.AsApiResult() });
            }
            try
            {
                var emailGrain = GrainClient.GrainFactory.GetGrain<IEmailGrain>(0);
                await emailGrain.SendEmail(new Email {
                            To = new List<string> { "maarten@sikkema.com" },
                            MessageBody = $"<p>Keep me informed: {model.Email}</p>",
                            Subject = $"Testing: subscriber request for {model.Email}",
                        });

                return Ok(new FormResponse { Message = "Geregistreerd!", Result = ApiResult.AsSuccess() });
            }
            catch (Exception e)
            {
                var result = new FormResponse { Result = ApiResult.AsException(e, includeExceptions: true), Message = "An Error occurred :-(" };
                return BadRequest(result);
            }
        }
    }
}
