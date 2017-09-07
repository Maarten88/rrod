using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;

namespace Webapp.Account
{
    [JsonObject]
    public class ForgotPasswordViewModel
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }
    }
}
