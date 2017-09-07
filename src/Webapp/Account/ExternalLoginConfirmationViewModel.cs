using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;

namespace Webapp.Account
{
    [JsonObject]
    public class ExternalLoginConfirmationViewModel
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }
    }
}
