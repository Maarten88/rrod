using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Security.Cryptography;
using System.Security.Cryptography.X509Certificates;
using System.Threading.Tasks;

namespace Webapp.Services
{
    public class CertHelper
    {
        public static X509Certificate2 BuildTlsSelfSignedServer(string[] domains)
        {
            var sanBuilder = new SubjectAlternativeNameBuilder();
            foreach (string domain in domains)
                sanBuilder.AddDnsName(domain);

            using (RSA rsa = RSA.Create())
            {
                var request = new CertificateRequest("CN=" + domains.First(), rsa, HashAlgorithmName.SHA256, RSASignaturePadding.Pkcs1);

                request.CertificateExtensions.Add(
                    new X509EnhancedKeyUsageExtension(
                        new OidCollection { new Oid("1.3.6.1.5.5.7.3.1") }, false));

                request.CertificateExtensions.Add(sanBuilder.Build());

                var cert = request.CreateSelfSigned(DateTimeOffset.UtcNow, DateTimeOffset.UtcNow.AddDays(90));

                // Hack - https://github.com/dotnet/corefx/issues/24454
                var buffer = cert.Export(X509ContentType.Pfx, (string) null);
	            return new X509Certificate2(buffer, (string) null);
            }
        }
    }
}
