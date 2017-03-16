using Orleans;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace GrainInterfaces
{
    // because System.Mail.Attachment is not serializable
    [Serializable]
    public class Attachment
    {
        public byte[] Data { get; set; }
        public string MimeType { get; set; }
        public string Name { get; set; }

        public Attachment()
        {
        }
        public Attachment(byte[] data, string name, string mimeType)
        {
            this.Data = data;
            this.Name = name;
            this.MimeType = mimeType;
        }
    }


    [Serializable]
    public class Email
    {
        public List<string> To { get; set; }
        public string From { get; set; }
        public List<string> CC { get; set; }
        public string Subject { get; set; }
        public string MessageBody { get; set; }
        public List<Attachment> Attachments { get; set; }

        public Email()
        {
            To = new List<string>();
            CC = new List<string>();
            Attachments = null;
        }
    }

    public interface IEmailGrain : IGrainWithIntegerKey
    {
        Task SendEmail(Email email);
    }
}
