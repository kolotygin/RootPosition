using System.Web.Mvc;
using System.Web.Routing;

namespace RootPosition
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

            routes.MapRoute(
                name: "GetImage",
                url: "Image/{file}",
                defaults: new { controller = "Image", action = "Render", file = UrlParameter.Optional }
            );

            routes.MapRoute(
                name: "GetResizedImage",
                url: "Image/{width}/{height}/{*file}",
                defaults: new { controller = "Image", action = "Resize", file = "" }
            );

            routes.MapRoute(
                name: "GetResizedImage-WithoutHeight",
                url: "Image/{width}/{file}",
                defaults: new { controller = "Image", action = "Resize" }
            );

            routes.MapRoute(
                name: "Default",
                url: "{controller}/{action}/{id}",
                defaults: new { controller = "Home", action = "Index", id = UrlParameter.Optional }
            );
        }
    }
}