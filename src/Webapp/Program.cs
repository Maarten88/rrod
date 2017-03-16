using System;
using System.IO;
using System.Threading;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Orleans;
using Orleans.Runtime;
using Orleans.Runtime.Configuration;
using Microsoft.Extensions.Logging;
using System.Linq;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.AspNetCore.Builder;
using Webapp.Services;
using GrainInterfaces;
using Orleans.Concurrency;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using Microsoft.AspNetCore.ResponseCompression;
using System.IO.Compression;
using Microsoft.AspNetCore.SpaServices.Webpack;
using Webapp.Controllers;
using Webapp.Identity;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Protocols.OpenIdConnect;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Extensions.Options;
using Microsoft.AspNetCore.Identity;
using IdentityModel;
using System.IdentityModel.Tokens;
using IdentityServer4;
using Orleans.Serialization;

namespace Webapp
{
    public class Program
    {
        public static IConfigurationRoot Configuration;
        public static readonly ILoggerFactory loggerFactory = new LoggerFactory();

        public static void Main(string[] args)
        {
            string environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Development";
            bool isDevelopment = "Development".Equals(environment, StringComparison.OrdinalIgnoreCase);

            var builder = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
                .AddJsonFile($"appsettings.{environment}.json", optional: true)
                .AddEnvironmentVariables();

            if (builder.GetFileProvider().GetFileInfo("Webapp.csproj").Exists)
            {
                builder.AddUserSecrets();
            }

            Configuration = builder.Build();

            loggerFactory.AddConsole(Configuration.GetSection("Logging"));
            loggerFactory.AddDebug();


            // Initialize the connection to the OrleansHost process
            var orleansClientConfig = ClientConfiguration.LocalhostSilo();
            orleansClientConfig.DeploymentId = Configuration["DeploymentId"];
            orleansClientConfig.DataConnectionString = Configuration.GetConnectionString("DataConnectionString");
            orleansClientConfig.AddSimpleMessageStreamProvider("Default");
            orleansClientConfig.DefaultTraceLevel = Orleans.Runtime.Severity.Warning;
            orleansClientConfig.TraceFileName = "";
            do
            {
                try
                {
                    GrainClient.Initialize(orleansClientConfig);
                }
                catch (Exception ex) when (ex is OrleansException || ex is SiloUnavailableException)
                {
                    // Wait for the Host to start
                    Thread.Sleep(3000);
                }
            }
            while (!GrainClient.IsInitialized);

            // we use a single settings file, that also contains the hosting settings
            var urls = (Configuration[WebHostDefaults.ServerUrlsKey] ?? "http://localhost:5000")
                .Split(new[] { ',', ';' })
                .Select(url => url.Trim())
                .ToArray();

            // find out if we run any secure urls
            var secureUrls = urls
                .Distinct()
                .Select(url => new Uri(url))
                .Where(uri => uri.Scheme == "https")
                .ToArray();

            // if so, start a listener to respond to Acme (Let's Encrypt) requests, using a response received via an Orleans Cache Grain
            IWebHost acmeHost = null;
            if (secureUrls.Any())
            {
                acmeHost = new WebHostBuilder()
                    .UseEnvironment(environment)
                    .ConfigureServices(services => {
                        services.AddSingleton<IConfiguration>(Configuration);
                        services.Configure<AcmeSettings>(Configuration.GetSection("AcmeSettings"));
                    })
                    .UseUrls("http://*:80/.well-known/acme-challenge/")
                    .UseKestrel()
                    .UseLoggerFactory(loggerFactory)
                    .Configure(app => {
                        app.UseAcmeResponse(async (challenge) => 
                        { 
                            var cacheGrain = GrainClient.GrainFactory.GetGrain<ICacheGrain<string>>(challenge);
                            var response = await cacheGrain.Get();
                            return response.Value;
                        });
                    })
                    .Build();

                try
                {
                    acmeHost.Start();
                }
                catch (Exception e)
                {
                    var logger = loggerFactory.CreateLogger<Program>();
                    logger.LogError("Error: can't start web listener for acme certificate renewal, probably the web address is in use by another process. Exception message is: " + e.Message);
                    logger.LogError("Ignoring noncritical error (stop W3SVC or Skype to fix this), continuing...");
                }
            }

            // It is possible to request Acme certificates with subject alternative names, but this is not yet implemented.
            // Usually we'll need only a single address, so I'm taking the first one
            // string firstSecureHost = secureUrls.Any() ? secureUrls.First().Host : null;
            var listenUrls = urls
                .Distinct()
                .Where(url => url.StartsWith("http://"));

            string[] httpsDomains;
            if (secureUrls.Any())
            {
                // Kestrel can only listen once to any given port, so we make sure multiple https addresses get only one listener
                var httpsListen = secureUrls.GroupBy(url => url.Port).Select(url => url.First()).Select(url => "https://*:" + url.Port);
                listenUrls = listenUrls.Union(httpsListen);
                httpsDomains = secureUrls.Select(url => url.Host).Distinct().ToArray();
            }
            else
            {
                httpsDomains = new string[] { };
            }

            var host = new WebHostBuilder()
                .UseContentRoot(Directory.GetCurrentDirectory())
                .UseEnvironment(environment)
                .UseUrls(listenUrls.ToArray())
                .UseLoggerFactory(loggerFactory)
                .ConfigureServices(services =>
                {
                    services.AddSingleton<IConfiguration>(Configuration);
                    services.Configure<AcmeSettings>(Configuration.GetSection("AcmeSettings"));

                    // TODO DotNetCore 2.0 configure the cookie name: https://github.com/aspnet/Mvc/commit/17dc23a024c1219ec58c48199f8d4f23117cf348
                    // services.Configure<CookieTempDataProviderOptions>(options => options.CookieName = "SESSION");

                    // Register service for session cookie (used in controller)
                    services.AddSingleton<ITempDataProvider, CookieTempDataProvider>();

                    // Add a basic Orleans-based distributed cache
                    services.AddOrleansCache();

                    // If we have at least one https url configured, then configure a custom Middleware that can store and retreive certificates and challenge responses
                    // We permanently store certificates in a specialized grain, and store the challenge responses in our generic cache grain
                    if (secureUrls.Any())
                    {
                        services.AddAcmeCertificateManager(options => {
                            options.DomainNames = httpsDomains;
                            options.ChallengeResponseReceiver = async (challenge, response) => 
                            { 
                                var cacheGrain = GrainClient.GrainFactory.GetGrain<ICacheGrain<string>>(challenge);
                                await cacheGrain.Set(new Immutable<string>(response), TimeSpan.FromHours(2));
                            };
                            options.StoreCertificate = async (string domainName, byte[] certData) => {
                                var certGrain = GrainClient.GrainFactory.GetGrain<ICertGrain>(domainName);
                                await certGrain.UpdateCertificate(certData);
                            };
                            options.RetreiveCertificate = async (domainName) => {
                                var certGrain = GrainClient.GrainFactory.GetGrain<ICertGrain>(domainName);
                                var certData = await certGrain.GetCertificate();
                                return certData.Value;
                            };
                        });
                    }
                    services.Configure<GzipCompressionProviderOptions>(options => options.Level = CompressionLevel.Fastest);
                    services.AddResponseCompression(options => {
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

                    // var jwtAppSettingOptions = Configuration.GetSection(nameof(JwtIssuerOptions));
                    // Configure JwtIssuerOptions
                    services.Configure<JwtIssuerOptions>(Configuration.GetSection(nameof(JwtIssuerOptions)));

                    services.AddIdentity<ApplicationUser, UserRole>(options => {
                        options.Password.RequireDigit = false;
                        options.Password.RequireLowercase = false;
                        options.Password.RequireUppercase = false;
                        options.Password.RequireNonAlphanumeric = false; ;
                        options.Password.RequiredLength = 5;
                    })
                    .AddUserStore<OrleansUserStore>()
                    .AddRoleStore<OrleansRoleStore>()
                    .AddUserManager<ApplicationUserManager>()
                    // .AddIdentityServerUserClaimsPrincipalFactory()
                    .AddClaimsPrincipalFactory<ApplicationUserClaimsPrincipalFactory>()
                    .AddDefaultTokenProviders();

                    services.AddTransient<IEmailSender, AuthMessageSender>();
                    services.AddTransient<ISmsSender, AuthMessageSender>();

                    // IdentityServer Authentication
                    services.AddIdentityServer()
                        .AddTemporarySigningCredential()
                        .AddInMemoryApiResources(Config.GetApiResources())
                        .AddInMemoryClients(Config.GetClients());
        
                    // services.AddWebSocketManager();
                    
                    services.AddNodeServices(options => {
                        if ("development".Equals(environment, StringComparison.OrdinalIgnoreCase))
                        {
                            options.LaunchWithDebugging = true;
                            options.DebuggingPort = 5858;
                        }
                        options.NodeInstanceOutputLogger = loggerFactory.CreateLogger("Node Console Logger");
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
                })
                .Configure(app =>
                {
                    var env = app.ApplicationServices.GetService<IHostingEnvironment>();
                    if (env.IsDevelopment())
                    {
                        app.UseDeveloperExceptionPage();
                        app.UseWebpackDevMiddleware(new WebpackDevMiddlewareOptions
                        {
                            HotModuleReplacement = true,
                            HotModuleReplacementServerPort = 6000,
                            ReactHotModuleReplacement = true,

                        });
                    }
                    else
                    {
                        app.UseExceptionHandler("/Home/Error");
                    }

                    app.UseIdentity();

                    app.UseIdentityServer();

                    JwtSecurityTokenHandler.InboundClaimTypeMap.Clear();

                    app.UseIdentityServerAuthentication(new IdentityServerAuthenticationOptions
                    {
                        Authority = urls.First(),
                        LegacyAudienceValidation = false,
                        
                        // AuthenticationScheme = IdentityServerConstants.DefaultCookieAuthenticationScheme,
                        // SupportedTokens = IdentityServer4.AccessTokenValidation.SupportedTokens.Jwt,
                        RequireHttpsMetadata = false, // !env.IsDevelopment(),
                        ApiName = urls.First(),
                        JwtBearerEvents = new JwtBearerEvents
                        {
                            OnAuthenticationFailed = async (ctx) => 
                            {
                                await Task.FromResult(0);
                            },
                            OnChallenge = async (ctx) => 
                            {
                                await Task.FromResult(0);
                            },
                            OnMessageReceived = async (ctx) => 
                            {
                                await Task.FromResult(0);
                            },
                            OnTokenValidated = async (ctx) => 
                            {
                                await Task.FromResult(0);
                            }
                        }
                    });

                    app.UseOpenIdConnectAuthentication(new OpenIdConnectOptions
                    {
                        AutomaticAuthenticate = true,

                        // Note: setting the Authority allows the OIDC client middleware to automatically
                        // retrieve the identity provider's configuration and spare you from setting
                        // the different endpoints URIs or the token validation parameters explicitly.
                        Authority = urls.First(),
                        AuthenticationScheme = OpenIdConnectDefaults.AuthenticationScheme,
                        // Note: these settings must match the application details
                        // inserted in the database at the server level.
                        ClientId = urls.First(),
                        ClientSecret = "secret",
                        PostLogoutRedirectUri = "/signedout",

                        RequireHttpsMetadata = false,
                        GetClaimsFromUserInfoEndpoint = true,
                        SaveTokens = true,

                        // Use the authorization code flow.
                        ResponseType = OpenIdConnectResponseType.CodeIdToken,
                        AuthenticationMethod = OpenIdConnectRedirectBehavior.RedirectGet,
                        CallbackPath = "/signin-oidc", // this is the default value
                        Resource = urls.First(),

                        Scope = { "openid", "profile", "email", "roles", "offline_access" },
                        Events = new OpenIdConnectEvents()
                        {
                            OnUserInformationReceived = async ctx =>
                            {
                                await Task.FromResult(0);
                            },
                            OnTokenValidated = async ctx =>
                            {
                                // var identity = ctx.Ticket.Principal.Identity as ClaimsIdentity;
                                await Task.FromResult(0);
                            },
                            OnAuthenticationFailed = async ctx =>
                            {
                                await Task.FromResult(0);
                            },
                            OnAuthorizationCodeReceived = async ctx =>
                            {
                                await Task.FromResult(0);
                            },
                            OnTokenResponseReceived = async ctx =>
                            {
                                await Task.FromResult(0);
                            },
                            OnRedirectToIdentityProvider = async ctx =>
                            {
                                await Task.FromResult(0);
                            }
                        }
                    });

                    // if a .gz version of a static file is available (created by webpack), send that one
                    app.UseCompressedStaticFiles();
                    app.UseStaticFiles();
                    app.UseResponseCompression();

                    //var jwtIssuerOptions = app.ApplicationServices.GetRequiredService<IOptions<JwtIssuerOptions>>();
                    //var tokenValidationParameters = new TokenValidationParameters
                    //{
                    //    ValidateIssuer = true,
                    //    ValidIssuer = jwtIssuerOptions.Value.Issuer,

                    //    ValidateAudience = true,
                    //    ValidAudiences = new[] { jwtIssuerOptions.Value.Audience }, //  jwtIssuerOptions.Value.Audience,

                    //    ValidateIssuerSigningKey = true,
                    //    // IssuerSigningKey = new X509SecurityKey(signingCert),

                    //    RequireExpirationTime = true,
                    //    ValidateLifetime = true,

                    //    ClockSkew = TimeSpan.FromMinutes(5)
                    //};

                    //app.UseJwtBearerAuthentication(new JwtBearerOptions
                    //{
                    //    AutomaticAuthenticate = true,
                    //    AutomaticChallenge = true,
                    //    RequireHttpsMetadata = false,
                    //    // Audience = jwtIssuerOptions.Value.Audience,
                    //    Authority = urls.First(),
                    //    TokenValidationParameters = tokenValidationParameters,
                        
                    //    Events = new JwtBearerEvents
                    //    {
                    //        OnAuthenticationFailed = async (ctx) => {
                    //            await Task.FromResult(0);
                    //        },
                    //        OnMessageReceived = async (ctx) => {
                    //            await Task.FromResult(0);
                    //        },
                    //        OnChallenge = async (ctx) => {
                    //            await Task.FromResult(0);
                    //        },
                    //        OnTokenValidated = async (ctx) => {
                    //            await Task.FromResult(0);
                    //        }
                    //    }
                    //});

                    app.UseWebSockets();
                    app.Map("/actions", ap => ap.UseMiddleware<WebSocketHandlerMiddleware>(new ActionsHandler()));

                    app.UseMvc(routes =>
                    {
                        routes.MapRoute(
                            name: "default",
                            template: "{controller=Home}/{action=Index}/{id?}");

                        routes.MapSpaFallbackRoute(
                            name: "spa-fallback",
                            defaults: new { controller = "Home", action = "Index" });
                    });
                })
                .UseKestrel(async options => {
                    // TODO: Make this into a nice Kestrel.Https.Acme nuget package
                    if (secureUrls.Any())
                    {
                        var certificateManager = options.ApplicationServices.GetService<ICertificateManager>();
                        var certificate = await certificateManager.GetCertificate(httpsDomains);
                        if (certificate != null)
                            options.UseHttps(certificate);

                        if (acmeHost != null)
                        {
                            // Stop the acme listener, to avoid duplicate port bindings in Kestrel if we want to bind our site to port 80 too
                            acmeHost.Dispose();
                            acmeHost = null;
                        }
                    }
                })
                .Build();

            host.Run();
        }
    }
}
