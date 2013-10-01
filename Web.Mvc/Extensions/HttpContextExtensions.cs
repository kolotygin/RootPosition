using System.Web;

namespace Web.Mvc.Extensions
{
	public static class HttpContextExtensions
	{
		public static string GetControllerName(this HttpContext context)
		{
			return context.Request.RequestContext.RouteData.Values["controller"] as string;
		}
	}
}
