using System;
using System.Linq.Expressions;
using System.Web.Mvc;
using System.Web.Routing;

namespace Web.Mvc.Extensions
{
    public static class UrlHelperExtensions
    {

        public static string Action<TController>(this UrlHelper helper, Expression<Action<TController>> action) where TController : Controller
        {
            RouteValueDictionary routeValues = GetRouteValuesFromExpression(action);
            return helper.Action(routeValues["action"] as string, routeValues);
        }

        // copied from MvcFutures
        // http://aspnet.codeplex.com/SourceControl/changeset/view/72551#266392
        private static RouteValueDictionary GetRouteValuesFromExpression<TController>(Expression<Action<TController>> action) where TController : Controller
        {
            MethodCallExpression call = action.Body as MethodCallExpression;
            string controllerName = typeof(TController).Name;
            controllerName = controllerName.Substring(0, controllerName.Length - "Controller".Length);
            return new RouteValueDictionary {{"controller", controllerName}, {"action", call.Method.Name}};
        }
    }

}
