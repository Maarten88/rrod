using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;

namespace Webapp.Account
{
    [JsonObject]
    public class RegisterResponseModel: ApiModel
    {
        [JsonProperty(DefaultValueHandling = DefaultValueHandling.Ignore)]
        public string NewXsrfToken { get; set; }
    }
}
