using System.Web.Mvc;

namespace Web.Mvc.Html
{
	public static class MvcUrl
	{
		public static UrlHelper Url(this HtmlHelper helper)
		{
			// Instantiate a UrlHelper
			return new UrlHelper(helper.ViewContext.RequestContext);
		}
	}
}
