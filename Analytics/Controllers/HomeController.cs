using System.Web.Mvc;
using Root.Analytics.Models;

namespace Root.Analytics.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            ViewBag.Title = "D3.js";
            var model = GetOptions();
            return View(model);
        }

        private AnalyticsOptions GetOptions()
        {
            var options = new AnalyticsOptions
            {
                Services =
                {
                    GetStatsViewDataMethod = "GetStatsData",
                    GetGraphViewDataMethod = "GetGraphData",
                    GetMapViewDataMethod = "GetMapData",
                    GetChoroplethViewDataMethod = "GetChoroplethData",
                    ServiceRoot = "Analytics"
                }
            };
            return options;
        }

    }
}
