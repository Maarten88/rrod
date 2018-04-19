using GrainInterfaces;
using Microsoft.Extensions.Options;
using Orleans;
using Orleans.Concurrency;
using Orleans.Runtime;
using System;
using System.Data.Common;
using System.IO;
using System.Threading.Tasks;
using MimeKit;
using MailKit.Net.Smtp;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Configuration;

namespace Grains
{
    [StatelessWorker]
    public class EmailGrain : Grain, IEmailGrain
    {
        readonly SmtpConnectionString smtpSettings;
        readonly ILogger<EmailGrain> logger;

        public EmailGrain(IConfiguration config, ILogger<EmailGrain> logger)
        {
            this.smtpSettings = new SmtpConnectionString()
            {
                ConnectionString = config.GetConnectionString("SmtpConnectionString")
            };
            this.logger = logger;
        }

        public Task SendEmail(Email email)
        {
            var message = new MimeMessage ();
            message.From.Add (new MailboxAddress (smtpSettings.FromDisplayName, smtpSettings.FromAddress));
            email.To.ForEach(address => message.To.Add(MailboxAddress.Parse(address)));
            message.Subject = email.Subject.Replace('\r', ' ').Replace('\n', ' ');
            var body = new TextPart("html") { Text = email.MessageBody };
            if (email.Attachments!= null)
            {
                var multipart = new Multipart("mixed")
                {
                    body
                };
                email.Attachments.ForEach(attachment => {
                    multipart.Add(new MimePart (attachment.MimeType) {
                        Content = new MimeContent (new MemoryStream(attachment.Data), ContentEncoding.Default),
                        ContentDisposition = new ContentDisposition (ContentDisposition.Attachment),
                        ContentTransferEncoding = ContentEncoding.Base64,
                        FileName = attachment.Name
                    });
                });
                message.Body = multipart;
            }
            else
            {
                message.Body = body;
            }

            Task.Run(() =>
            {
                try
                {
                    using (var client = new SmtpClient ()) 
                    {
                        // For demo-purposes, accept all SSL certificates (in case the server supports STARTTLS)
                        client.ServerCertificateValidationCallback = (s,c,h,e) => true;

                        client.Connect (smtpSettings.Host, smtpSettings.Port, false);

                        // Note: since we don't have an OAuth2 token, disable
                        // the XOAUTH2 authentication mechanism.
                        client.AuthenticationMechanisms.Remove ("XOAUTH2");

                        // Note: only needed if the SMTP server requires authentication
                        client.Authenticate (smtpSettings.UserName, smtpSettings.Password);

                        client.Send (message);
                        client.Disconnect (true);
                    }
                }
                catch (Exception e)
                {
                    this.logger.LogError(e, "EmailGrain: Error sending email");
                }
            });

            return Task.CompletedTask;
        }
    }


    public class SmtpConnectionString : DbConnectionStringBuilder
    {
        public string Host
        {
            get
            {
                return this.TryGetValue("Host", out object host) ? host.ToString() : null;
            }
            set
            {
                this["Host"] = value;
            }
        }
        public int Port
        {
            get
            {
                return this.TryGetValue("Port", out object val) && int.TryParse(val.ToString(), out int port) ? port : 587;
            }
            set
            {
                this["Port"] = value;
            }
        }
        public bool EnableSsl
        {
            get => this.TryGetValue("EnableSsl", out object val) && string.Equals(val.ToString(), "false", StringComparison.OrdinalIgnoreCase) ? false : true; //default = true
            set
            {
                this["EnableSsl"] = value;
            }
        }

        public string UserName
        {
            get
            {
                return this.TryGetValue("UserName", out object userName) ? userName.ToString() : null;
            }
            set
            {
                this["UserName"] = value;
            }
        }

        public string Password
        {
            get
            {
                return this.TryGetValue("Password", out object password) ? password.ToString() : null;
            }
            set
            {
                this["Password"] = value;
            }
        }

        public string FromAddress
        {
            get => this.TryGetValue("FromAddress", out object fromAddress) ? fromAddress.ToString() : "rrod@example.com";
            set
            {
                this["FromAddress"] = value;
            }
        }
        public string FromDisplayName
        {
            get
            {
                return this.TryGetValue("FromDisplayName", out object fromDisplayName) ? fromDisplayName.ToString() : "RROD";
            }
            set
            {
                this["FromDisplayName"] = value;
            }
        }

    }
}
