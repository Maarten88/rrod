using System.ComponentModel.DataAnnotations;

namespace Webapp.Account
{
    public class ForgotPasswordViewModel
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }
    }
}
