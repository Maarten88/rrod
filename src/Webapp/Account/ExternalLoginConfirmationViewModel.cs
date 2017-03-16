using System.ComponentModel.DataAnnotations;

namespace Webapp.Account
{
    public class ExternalLoginConfirmationViewModel
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }
    }
}
