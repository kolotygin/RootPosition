using System.Web.Mvc;
using RootPosition.Analytics.Models;

namespace Analytics.Controllers
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
                    GetStatsViewDataMethod = "AnalyticsService/GetStatsData",
                    GetGraphViewDataMethod = "AnalyticsService/GetGraphData",
                    GetMapViewDataMethod = "AnalyticsService/GetMapData",
                    GetChoroplethViewDataMethod = "AnalyticsService/GetChoroplethData",
                    ServiceRoot = "Analytics"
                }
            };
            return options;
        }

    }
}
