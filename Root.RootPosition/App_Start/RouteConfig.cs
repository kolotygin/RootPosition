using System.Web.Mvc;
using System.Web.Routing;

namespace Root.RootPosition
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

            routes.MapRoute(
                name: "GetImage",
                url: "Image/{file}",
                defaults: new { controller = "Image", action = "Render", file = UrlParameter.Optional },
                namespaces: new[] { "Root.RootPosition.Controllers" }
            );

            routes.MapRoute(
                name: "GetResizedImage",
                url: "Image/{width}/{height}/{*file}",
                defaults: new { controller = "Image", action = "Resize", file = "" },
                namespaces: new[] { "Root.RootPosition.Controllers" }
            );

            routes.MapRoute(
                name: "GetResizedImage-WithoutHeight",
                url: "Image/{width}/{file}",
                defaults: new { controller = "Image", action = "Resize" },
                namespaces: new[] { "Root.RootPosition.Controllers" }
            );

            routes.MapRoute(
                name: "Default",
                url: "{controller}/{action}/{id}",
                defaults: new { controller = "Home", action = "Index", id = UrlParameter.Optional },
                namespaces: new[] { "Root.RootPosition.Controllers" }
            );
        }
    }
}