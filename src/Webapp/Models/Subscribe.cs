using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;

namespace Webapp.Models
{
    [JsonObject]
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
