using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc.Rendering;

namespace Webapp.Account
{
    public class ListItemModel
    {
        public string Text { get; set; }
        public string Value { get; set; }
    }

    public class SendCodeViewModel
    {
        public string SelectedProvider { get; set; }

        public ICollection<ListItemModel> Providers { get; set; }

        public string ReturnUrl { get; set; }

        public bool RememberMe { get; set; }
    }
}
