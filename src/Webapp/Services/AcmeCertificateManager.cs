using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using System;
using Webapp.Services;
using System.Threading.Tasks;
using Certes;
using Certes.Acme;
using System.Linq;
using Certes.Pkcs;
using System.Security.Cryptography.X509Certificates;
using Microsoft.AspNetCore.Hosting;
using Certes.Acme.Resource;

namespace Microsoft.AspNetCore.Hosting
{
    public static class AcmeConfigurationExtesions
    {
        public static void AddAcmeCertificateManager(this IServiceCollection services, Action<AcmeOptions> options)
        {
            services.AddTransient<IConfigureOptions<AcmeOptions>, AcmeOptionsSetup>();
            services.Configure(options);
            services.AddTransient<ICertificateManager, AcmeCertificateManager>();
        }

        public static void AddAcmeCertificateManager(this IServiceCollection services, AcmeOptions options)
        {
            services.AddTransient<IConfigureOptions<AcmeOptions>, AcmeOptionsSetup>();
            // services.AddSingleton(Options.Create(options));
            services.AddTransient(sp =>
            {
                var setup = sp.GetService<IConfigureOptions<AcmeOptions>>();
                setup.Configure(options);
                return Options.Create(options);
            });
            services.AddTransient<ICertificateManager, AcmeCertificateManager>();
        }
    }

    public interface ICertificateManager
    {
        Task<string> GetChallengeResponse(string challenge);
        Task<X509Certificate2> GetCertificate(string[] domainNames);
    }

    public class AcmeCertificateManager: ICertificateManager
    {
        readonly AcmeOptions options;
        public AcmeCertificateManager(IOptions<AcmeOptions> options)
        {
            this.options = options.Value;
        }

        public Task<string> GetChallengeResponse(string challenge)
        {
            return this.options.GetChallengeResponse(challenge);
        }

        public async Task<X509Certificate2> GetCertificate(string[] domainNames)
        {
            // TODO Create a double lock around this using another option method so this does not get 
            // run on multiple machines at the same time...
            X509Certificate2 cert = null;
            byte[] pfx = await options.RetrieveCertificate(domainNames.First());
            if (pfx != null)
            {
                cert = new X509Certificate2(pfx, options.AcmeSettings.PfxPassword);
                if (cert.NotAfter - DateTime.UtcNow < TimeSpan.FromDays(21))
                {
                    // Request a new cert 21 days before the current one expires
                    pfx = await RequestNewCertificate(domainNames, options.AcmeSettings, options.SetChallengeResponse);
                    if (pfx != null)
                    {
                        await options.StoreCertificate(domainNames.First(), pfx);
                        cert = new X509Certificate2(pfx, options.AcmeSettings.PfxPassword);
                    }
                }
            }
            else
            {
                pfx = await RequestNewCertificate(domainNames, options.AcmeSettings, options.SetChallengeResponse);
                if (pfx != null)
                {
                    await options.StoreCertificate(domainNames.First(), pfx);
                    cert = new X509Certificate2(pfx, options.AcmeSettings.PfxPassword);
                }
            }
            return cert;
        }

        static async Task<byte[]> RequestNewCertificate(string[] domainNames, AcmeSettings acmeSettings, Func<string, string, Task> challengeResponseReceiver)
        {
            using (var client = new AcmeClient(new Uri(acmeSettings.AcmeUri)))
            {
                // Create new registration
                var account = await client.NewRegistraton($"mailto:{acmeSettings.EmailAddress}");

                // Accept terms of services
                account.Data.Agreement = account.GetTermsOfServiceUri();
                account = await client.UpdateRegistration(account);

                bool unauthorizedDomain = false;
                // optimization: paralellize this
                // var result = Parallel.ForEach(domainNames, async (domaiName, state) => { state.Break(); });
                // await Task.WhenAll(domainNames.Select(async (domainName) => { await Task.FromResult(0); }));
                foreach (var domainName in domainNames) 
                {
                    
                    // Initialize authorization
                    var authz = await client.NewAuthorization(new AuthorizationIdentifier
                    {
                        Type = AuthorizationIdentifierTypes.Dns,
                        Value = domainName
                    });

                    // Comptue key authorization for http-01
                    var httpChallengeInfo = authz.Data.Challenges.Where(c => c.Type == ChallengeTypes.Http01).First();
                    var keyAuthString = client.ComputeKeyAuthorization(httpChallengeInfo);

                    // Do something to fullfill the challenge,
                    // e.g. upload key auth string to well known path, or make changes to DNS

                    // var cacheGrain = base.GrainFactory.GetGrain<ICacheGrain<string>>($"challenge:{httpChallengeInfo}");
                    // await cacheGrain.Set(new Immutable<string>(keyAuthString), TimeSpan.FromHours(2));
                    await challengeResponseReceiver(httpChallengeInfo.Token, keyAuthString);

                    // Info ACME server to validate the identifier
                    var httpChallenge = await client.CompleteChallenge(httpChallengeInfo);

                    // Check authorization status
                    int tryCount = 1;
                    do
                    {
                        // Wait for ACME server to validate the identifier
                        await Task.Delay(5000);
                        authz = await client.GetAuthorization(httpChallenge.Location);
                    }
                    while (authz.Data.Status == EntityStatus.Pending && ++tryCount <= 10);

                    if (authz.Data.Status != EntityStatus.Valid)
                    {
                        unauthorizedDomain = true;
                        break;
                    }
                }

                if (!unauthorizedDomain)
                {
                    // Create certificate
                    var csr = new CertificationRequestBuilder();
                    csr.AddName("CN", domainNames.First()); // "www.my_domain.com";
                    foreach (var alternativeName in domainNames.Skip(1))
                    {
                        csr.SubjectAlternativeNames.Add(alternativeName);
                    }
                    var cert = await client.NewCertificate(csr);

                    // Export Pfx
                    var pfxBuilder = cert.ToPfx();
                    var pfx = pfxBuilder.Build(domainNames.First(), acmeSettings.PfxPassword);

                    return pfx;
                }
                else
                {
                    return null;
                }
            }
        }
    }

   public class AcmeOptionsSetup : IConfigureOptions<AcmeOptions>
    {
        // private IServiceProvider _services;
        private AcmeSettings _acmeSettings;

        public AcmeOptionsSetup(IServiceProvider services, IOptions<AcmeSettings> acmeSettings)
        {
            // _services = services;
            _acmeSettings = acmeSettings.Value;
        }

        public void Configure(AcmeOptions options)
        {
            // options.ApplicationServices = _services;
            options.AcmeSettings = _acmeSettings;
        }
    }
}