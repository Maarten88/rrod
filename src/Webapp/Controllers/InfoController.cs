using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Orleans;

namespace Webapp.Controllers
{
    // The home controller generates the initial home page, as wel as the aspnet-javascript serverside fallback pages (mostly for seo)
    public class InfoController : Controller
    {
        readonly IClusterClient clusterClient;
        readonly IHostingEnvironment env;
        readonly IConfiguration config;

        public InfoController(IClusterClient clusterClient, IHostingEnvironment env, IConfiguration config)
        {
            this.clusterClient = clusterClient;
            this.env = env;
            this.config = config;
        }

        [HttpGet, Route("~/info")]
        public IActionResult Index()
        {
            return Content($"Webapp is alive. Id = {config["Id"]}, Version = {config["Version"]}");
            // todo connect to orleanshost and get its version and Id
        }
    }
}