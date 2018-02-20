using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Webapp.Models
{
    public class EndpointConfiguration
    {
        public string Host { get; set; }
        public List<string> Hosts { get; set; } = new List<string>();
        public int? Port { get; set; }
        public string Scheme { get; set; }
        public string Domain { get; set; }
        public List<string> Domains { get; set; } = new List<string>();
    }
}
