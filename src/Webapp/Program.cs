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
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using Microsoft.AspNetCore.Identity;
using IdentityModel;
using System.IdentityModel.Tokens;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using System.Security.Claims;
using System.Net;

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
                builder.AddUserSecrets<Program>();
            }

            Configuration = builder.Build();

            loggerFactory.AddConsole(Configuration.GetSection("Logging"));
            loggerFactory.AddDebug();

            // Initialize the connection to the OrleansHost process
            var orleansClientConfig = ClientConfiguration.LocalhostSilo();
            orleansClientConfig.DeploymentId = Configuration["DeploymentId"];
            orleansClientConfig.DataConnectionString = Configuration.GetConnectionString("DataConnectionString");
            orleansClientConfig.AddSimpleMessageStreamProvider("Default");
            orleansClientConfig.DefaultTraceLevel = Severity.Warning;
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


            // It is possible to request Acme certificates with subject alternative names, but this is not yet implemented.
            // Usually we'll need only a single address, so I'm taking the first one
            // string firstSecureHost = secureUrls.Any() ? secureUrls.First().Host : null;
            var listenUrls = urls
                .Distinct()
                .Where(url => url.StartsWith("http://"));

            // if so, start a listener to respond to Acme (Let's Encrypt) requests, using a response received via an Orleans Cache Grain
            string[] httpsDomains;
            IWebHost acmeHost;
            AcmeOptions acmeOptions;

            if (!secureUrls.Any())
            {
                httpsDomains = new string[] { };
                acmeOptions = null;
                acmeHost = null;
            }
            else
            {
                // Kestrel can only listen once to any given port, so we make sure multiple https addresses get only one listener
                var httpsListen = secureUrls.GroupBy(url => url.Port).Select(url => url.First()).Select(url => "https://*:" + url.Port);
                listenUrls = listenUrls.Union(httpsListen);
                httpsDomains = secureUrls.Select(url => url.Host).Distinct().ToArray();

                acmeOptions = new AcmeOptions
                {
                    DomainNames = httpsDomains,
                    GetChallengeResponse = async (challenge) =>
                    {
                        var cacheGrain = GrainClient.GrainFactory.GetGrain<ICacheGrain<string>>(challenge);
                        var response = await cacheGrain.Get();
                        return response.Value;
                    },
                    SetChallengeResponse = async (challenge, response) =>
                    {
                        var cacheGrain = GrainClient.GrainFactory.GetGrain<ICacheGrain<string>>(challenge);
                        await cacheGrain.Set(new Immutable<string>(response), TimeSpan.FromHours(2));
                    },
                    StoreCertificate = async (string domainName, byte[] certData) =>
                    {
                        var certGrain = GrainClient.GrainFactory.GetGrain<ICertGrain>(domainName);
                        await certGrain.UpdateCertificate(certData);
                    },
                    RetrieveCertificate = async (domainName) =>
                    {
                        var certGrain = GrainClient.GrainFactory.GetGrain<ICertGrain>(domainName);
                        var certData = await certGrain.GetCertificate();
                        return certData.Value;
                    }
                };

                acmeHost = new WebHostBuilder()
                    .UseEnvironment(environment)
                    .ConfigureServices(services => {
                        services.AddSingleton<IConfiguration>(Configuration);
                        services.Configure<AcmeSettings>(Configuration.GetSection(nameof(AcmeSettings)));

                        // Register a certitificate manager, supplying methods to store and retreive certificates and acme challenge responses
                        services.AddAcmeCertificateManager(acmeOptions);
                    })
                    .UseUrls("http://*:80/.well-known/acme-challenge/")
                    .UseKestrel()
                    // .UseLoggerFactory(loggerFactory)
                    .Configure(app => {
                        app.UseAcmeResponse();
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

            var host = new WebHostBuilder()
                .UseContentRoot(Directory.GetCurrentDirectory())
                .UseEnvironment(environment)
                .UseUrls(listenUrls.ToArray())
                // .UseLoggerFactory(loggerFactory)
                .ConfigureServices(services =>
                {
                    services.AddSingleton<IConfiguration>(Configuration);
                    services.Configure<AcmeSettings>(Configuration.GetSection(nameof(AcmeSettings)));

                    // TODO DotNetCore 2.0 configure the cookie name: https://github.com/aspnet/Mvc/commit/17dc23a024c1219ec58c48199f8d4f23117cf348
                    // services.Configure<CookieTempDataProviderOptions>(options => options.CookieName = "SESSION");

                    // Register service for session cookie (used in controller)
                    services.AddSingleton<ITempDataProvider, CookieTempDataProvider>();

                    // Add a basic Orleans-based distributed cache
                    services.AddOrleansCache();
                   

                    if (secureUrls.Any())
                    {
                        services.AddAcmeCertificateManager(acmeOptions);
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
                    .AddCookie(options => {
                        options.LoginPath = "/login";
                        options.LogoutPath = "/logout";
                    })
                    .AddJwtBearer(options =>
                    {
                        options.Authority = urls.First();
                        options.RequireHttpsMetadata = environment != "Development";
                        options.Audience = urls.First();
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

                    // services.AddWebSocketManager();
                    services.AddNodeServices(options => {
                        if (isDevelopment)
                        {
                            options.LaunchWithDebugging = true;
                            options.DebuggingPort = 9229;
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
                    if (isDevelopment)
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

                    app.UseIdentityServer();

                    // if a .gz version of a static file is available (created by webpack), send that one
                    app.UseCompressedStaticFiles();
                    app.UseStaticFiles();
                    app.UseResponseCompression();

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
                        // Request a new certificate with Let's Encrypt and store it for next time
                        var certificateManager = options.ApplicationServices.GetService<ICertificateManager>();
                        var certificate = await certificateManager.GetCertificate(httpsDomains);
                        if (certificate != null)
                        {
                            options.Listen(IPAddress.Loopback, 443, listenOptions =>
                            {
                                listenOptions.UseHttps(certificate);
                            });                            
                        }
                        // options.UseHttps(certificate);

                        //if (acmeHost != null)
                        //{
                        //    // How to stop the acme listener? Kestrel doesn't support SNI, so we need to stop the acme listener to free up port 80 if we want to bind our regular site to that port too
                        //    acmeHost.Dispose();
                        //    acmeHost = null;
                        //}
                    }
                })
                .Build();

            host.Run();
        }
    }
}
