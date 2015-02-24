using System.Web.Mvc;
using System.Web.Routing;

namespace Analytics
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

            routes.MapRoute(
                name: "Analytics-GetStatsData",
                url: "Analytics/GetStatsData/{startDate}/{endDate}",
                defaults: new { controller = "Analytics", action = "GetStatsData", startDate = UrlParameter.Optional, endDate = UrlParameter.Optional }
            );

            routes.MapRoute(
                name: "Analytics-GetGraphData",
                url: "Analytics/GetGraphData/{startDate}/{endDate}/{scale}",
                defaults: new { controller = "Analytics", action = "GetGraphData", startDate = UrlParameter.Optional, endDate = UrlParameter.Optional, scale = UrlParameter.Optional }
            );

            routes.MapRoute(
                name: "Analytics-GetMapData",
                url: "Analytics/GetMapData/{country}",
                defaults: new { controller = "Analytics", action = "GetMapData", country = UrlParameter.Optional }
            );

            routes.MapRoute(
                name: "Analytics-GetChoroplethData",
                url: "Analytics/GetChoroplethData/{country}",
                defaults: new { controller = "Analytics", action = "GetChoroplethData", country = UrlParameter.Optional }
            );

            routes.MapRoute(
                name: "Default",
                url: "{controller}/{action}/{id}",
                defaults: new { controller = "Home", action = "Index", id = UrlParameter.Optional }
            );
        }
    }
}