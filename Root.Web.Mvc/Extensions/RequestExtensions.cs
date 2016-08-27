using System.Web.Routing;
using Root.Web.Mvc.Models;

namespace Root.Web.Mvc.Extensions
{
    public static class RequestExtensions
    {
        public static bool IsCurrentRoute(this RequestContext context, string areaName)
        {
            return context.IsCurrentRoute(areaName, null, null);
        }

        public static bool IsCurrentRoute(this RequestContext context, string areaName, string controllerName)
        {
            return context.IsCurrentRoute(areaName, controllerName, null);
        }

        public static bool IsCurrentRoute(this RequestContext context, string areaName, string controllerName, string actionName)
        {
            var url = new UrlModel { ActionName = actionName, ControllerName = controllerName, AreaName = areaName };
            return context.IsCurrentRoute(url);
        }

        public static bool IsCurrentRoute(this RequestContext context, UrlModel url)
        {
            var requestUrl = context.RouteData.GetCurrentUrl();
            return url.Equals(requestUrl);
        }

        public static UrlModel GetCurrentUrl(this RouteData data)
        {
            return new UrlModel
            {
                ControllerName = data.GetRequiredString("controller"),
                ActionName = data.GetRequiredString("action"),
                AreaName = data.DataTokens["area"] as string
            };
        }
    }
}
