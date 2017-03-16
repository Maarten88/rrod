using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using System;

namespace Webapp.Services
{
    public class AcmeSettings
    {
        public string EmailAddress { get; set; }
        public string TermsOfServiceUri { get; set; }
        public string PfxPassword { get; set; }
        public string AcmeServer { get; set; }

        public AcmeSettings()
        {
            AcmeServer = "https://acme-v01.api.letsencrypt.org/directory";
            TermsOfServiceUri = "https://letsencrypt.org/documents/LE-SA-v1.1.1-August-1-2016.pdf";
        }
    }

    public class AcmeOptions {
        public string[] DomainNames { get; set; }
        public AcmeSettings AcmeSettings { get; set; }
        // public IServiceProvider ApplicationServices { get; set; }
        public Func<string, string, Task> ChallengeResponseReceiver { get; set; } = (challenge, response) => Task.FromResult(0);
        public Func<string, byte[], Task> StoreCertificate { get; set; } = (domainName, certData) => Task.FromResult(0);
        public Func<string, Task<byte[]>> RetreiveCertificate { get; set; } = (domainName) => Task.FromResult<byte[]>(null);
    }

    public class AcmeResponseMiddleware
    {
        static readonly PathString startPath = new PathString("/.well-known/acme-challenge");
        private readonly RequestDelegate next;
        private readonly Func<string, Task<string>> challengeResponder;
        private readonly ILogger<AcmeResponseMiddleware> logger;

        public AcmeResponseMiddleware(RequestDelegate next, Func<string, Task<string>> challengeResponder, ILogger<AcmeResponseMiddleware> logger)
        {
            this.next = next;
            this.challengeResponder = challengeResponder;
            this.logger = logger;
        }

        public async Task Invoke(HttpContext context)
        {
            PathString requestPathId;
            PathString requestPath = context.Request.PathBase + context.Request.Path;
            if (requestPath.StartsWithSegments(startPath, out requestPathId))
            {
                string challenge = requestPathId.Value.TrimStart('/');
                this.logger.LogWarning($"Acme challenge received on {requestPath}, challenge id = {challenge}");

                // var cacheGrain = GrainClient.GrainFactory.GetGrain<ICacheGrain<string>>($"challenge:{challenge}");
                // var response = await cacheGrain.Get();

                string response = await challengeResponder(challenge);

                if (!string.IsNullOrEmpty(response))
                {
                    this.logger.LogWarning($"Acme challenge response found: {response}");
                    context.Response.ContentType = "text/plain";
                    context.Response.StatusCode = 200;
                    await context.Response.WriteAsync(response);
                }
                else
                {
                    this.logger.LogError($"Error: Acme challenge response for challenge id {challenge} NOT FOUND!");
                    context.Response.StatusCode = 404;
                }
            }
            else
            {
                await this.next.Invoke(context);
            }
        }
    }
}


namespace Microsoft.AspNetCore.Hosting
{
    using System;
    using Webapp.Services;
    public static class AcmeResponseExtensions
    {
        public static IApplicationBuilder UseAcmeResponse(this IApplicationBuilder builder, Func<string, Task<string>> challengeResponder)
        {
            return builder.UseMiddleware<AcmeResponseMiddleware>(challengeResponder);
        }
    }
}
