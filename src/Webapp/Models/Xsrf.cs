using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;

namespace Webapp.Models
{
    [JsonObject]
    public class XsrfModel
    {
        public string XsrfToken { get; set; }
    }
}
