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

namespace Grains
{
    public class ConnectionStrings
    {
        public string DataConnectionString { get; set; }
        public string ReduxConnectionString { get; set; }
        public string SmtpConnectionString { get; set; }
    }


    [StatelessWorker]
    public class EmailGrain : Grain, IEmailGrain
    {
        SmtpConnectionString _smtpSettings;
        Logger _logger;

        public EmailGrain(IOptions<ConnectionStrings> connectionStrings)
        {
            _smtpSettings = new SmtpConnectionString()
            {
                ConnectionString = connectionStrings.Value.SmtpConnectionString
            };
        }

        public override Task OnActivateAsync()
        {
            _logger = this.GetLogger();
            return base.OnActivateAsync();
        }

        public Task SendEmail(Email email)
        {
            var message = new MimeMessage ();
            message.From.Add (new MailboxAddress (_smtpSettings.FromDisplayName, _smtpSettings.FromAddress));
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
                        ContentObject = new ContentObject (new MemoryStream(attachment.Data), ContentEncoding.Default),
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

            Task.Run(async () =>
            {
                try
                {
                    using (var client = new SmtpClient ()) 
                    {
                        // For demo-purposes, accept all SSL certificates (in case the server supports STARTTLS)
                        client.ServerCertificateValidationCallback = (s,c,h,e) => true;

                        client.Connect (_smtpSettings.Host, _smtpSettings.Port, false);

                        // Note: since we don't have an OAuth2 token, disable
                        // the XOAUTH2 authentication mechanism.
                        client.AuthenticationMechanisms.Remove ("XOAUTH2");

                        // Note: only needed if the SMTP server requires authentication
                        client.Authenticate (_smtpSettings.UserName, _smtpSettings.Password);

                        client.Send (message);
                        client.Disconnect (true);
                    }
                }
                catch (Exception e)
                {
                    this._logger.Error(1002, "Error sending email", e);
                }
                await Task.FromResult(0);
            });

            return Task.FromResult(0);
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
            get => this.TryGetValue("FromAddress", out object fromAddress) ? fromAddress.ToString() : "maarten@sikkema.com";
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
