using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;

namespace Webapp.Models
{
    public class SubscribeModel
    {
        [EmailAddress]
        public string Email { get; set; }
    }


    [JsonObject]
    public class FormResponse : ApiModel
    {
        public string Message { get; set; }
    }

}
