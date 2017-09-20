using IdentityModel;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using Microsoft.AspNetCore.ResponseCompression;
using Microsoft.AspNetCore.SpaServices.Webpack;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using System.IO.Compression;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using Webapp.Identity;
using Webapp.Services;

namespace Webapp
{
    public class Startup
    {
        private readonly ILoggerFactory loggerFactory;
        private readonly IHostingEnvironment env;
        private readonly IConfiguration configuration;

        public Startup(IHostingEnvironment env, IConfiguration configuration, ILoggerFactory loggerFactory)
        {
            this.env = env;
            this.configuration = configuration;
            this.loggerFactory = loggerFactory;
        }

        public void ConfigureServices(IServiceCollection services)
        {
            services.AddOptions();
            services.Configure<AcmeSettings>(this.configuration.GetSection(nameof(AcmeSettings)));

            // TODO DotNetCore 2.0 configure the cookie name: https://github.com/aspnet/Mvc/commit/17dc23a024c1219ec58c48199f8d4f23117cf348
            // services.Configure<CookieTempDataProviderOptions>(options => options.CookieName = "SESSION");

            // Register service for session cookie (used in controller)
            services.AddSingleton<ITempDataProvider, CookieTempDataProvider>();

            // Add a basic Orleans-based distributed cache
            services.AddOrleansCache();

            services.Configure<GzipCompressionProviderOptions>(options => options.Level = CompressionLevel.Fastest);
            services.AddResponseCompression(options =>
            {
                options.EnableForHttps = true;
                options.Providers.Add<GzipCompressionProvider>();
            });

            services.AddAntiforgery(options =>
            {
                // options.CookieName = "XSRF-TOKEN";
                options.HeaderName = "X-XSRF-TOKEN";
            });

            services.AddAuthorization(options =>
            {
                options.AddPolicy("admin", policy =>
                {
                    policy.RequireClaim(JwtClaimTypes.Role, "admin");
                });
            });

            services.AddScoped<IUserClaimsPrincipalFactory<ApplicationUser>, ApplicationUserClaimsPrincipalFactory>();

            // var jwtAppSettingOptions = this.configuration.GetSection(nameof(JwtIssuerOptions));
            // Configure JwtIssuerOptions
            services.Configure<JwtIssuerOptions>(this.configuration.GetSection(nameof(JwtIssuerOptions)));

            services.AddIdentity<ApplicationUser, UserRole>(options =>
            {
                options.Password.RequireDigit = false;
                options.Password.RequireLowercase = false;
                options.Password.RequireUppercase = false;
                options.Password.RequireNonAlphanumeric = false; ;
                options.Password.RequiredLength = 5;
            })
            .AddUserStore<OrleansUserStore>()
            .AddRoleStore<OrleansRoleStore>()
            .AddUserManager<ApplicationUserManager>()
            .AddDefaultTokenProviders()
            .AddIdentityServer();

            services.AddTransient<IEmailSender, AuthMessageSender>();
            services.AddTransient<ISmsSender, AuthMessageSender>();

            // IdentityServer Authentication
            services.AddIdentityServer()
                .AddDeveloperSigningCredential()
                .AddInMemoryApiResources(Config.GetApiResources())
                .AddInMemoryClients(Config.GetClients())
                .AddAspNetIdentity<ApplicationUser>();

            //services
            //    .AddIdentityServerUserClaimsPrincipalFactory<ApplicationUser, UserRole>();

            services.AddAuthentication(IdentityConstants.ApplicationScheme)
            .AddCookie(options =>
            {
                options.LoginPath = "/login";
                options.LogoutPath = "/logout";
            })
            .AddJwtBearer(options =>
            {
                string baseUrl = this.configuration["baseUrl"];
                options.Authority = baseUrl;
                options.RequireHttpsMetadata = !this.env.IsDevelopment();
                options.Audience = baseUrl;
                // AllowedScopes = new[] { "email", "openid" },
                // ApiName = "actions",
                options.Events = new JwtBearerEvents
                {
                    // For debugging...
                    OnAuthenticationFailed = async (context) =>
                    {
                        await Task.FromResult(0);
                    },
                    OnChallenge = async (context) =>
                    {
                        await Task.FromResult(0);
                    },
                    OnMessageReceived = async (context) =>
                    {
                        await Task.FromResult(0);
                    },
                    OnTokenValidated = async (context) =>
                    {
                        await Task.FromResult(0);
                    }
                };
            });

            services.AddNodeServices(options =>
            {
                if (this.env.IsDevelopment())
                {
                    options.LaunchWithDebugging = true;
                    options.DebuggingPort = 9229;
                }
                options.NodeInstanceOutputLogger = this.loggerFactory.CreateLogger("Node Console Logger");
            });

            services.AddSignalR(options =>
            {
                options.JsonSerializerSettings = new JsonSerializerSettings()
                {
                    ContractResolver = new CamelCasePropertyNamesContractResolver(),
                    NullValueHandling = NullValueHandling.Ignore,
                };
            });

            // Add framework services.
            services
                .AddMvc()
                .AddJsonOptions(options =>
                {
                    options.SerializerSettings.NullValueHandling = NullValueHandling.Ignore;
                    options.SerializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();
                    options.SerializerSettings.Formatting = Formatting.Indented;
                    JsonConvert.DefaultSettings = () => new JsonSerializerSettings()
                    {
                        ContractResolver = new CamelCasePropertyNamesContractResolver(),
                        Formatting = Newtonsoft.Json.Formatting.Indented,
                        NullValueHandling = NullValueHandling.Ignore,
                    };
                });
        }

        public void Configure(IApplicationBuilder app)
        {
            if (this.env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseWebpackDevMiddleware(new WebpackDevMiddlewareOptions
                {
                    HotModuleReplacement = true,
                    HotModuleReplacementServerPort = 6000,
                    ReactHotModuleReplacement = false,
                });
            }
            else
            {
                app.UseExceptionHandler("/Home/Error");
            }

            app.UseIdentityServer();

            // if a .gz version of a static file is available (created by webpack), send that one
            app.UseCompressedStaticFiles();
            app.UseStaticFiles();
            app.UseResponseCompression();

            app.UseWebSockets();
            // app.Map("/actions", ap => ap.UseMiddleware<WebSocketHandlerMiddleware>(new ActionsHandler()));

            app.UseSignalR(routes =>
            {
                routes.MapHub<ActionsHub>("actionsr");
            });

            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "{controller=Home}/{action=Index}/{id?}");

                routes.MapSpaFallbackRoute(
                    name: "spa-fallback",
                    defaults: new { controller = "Home", action = "Index" });
            });
        }
    }
}
