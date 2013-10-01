using System.Collections.Generic;
using System.Text;
using System.Web;
using System.Web.Mvc;

namespace Web.Mvc.Html
{
	public static class MvcExternalResourcesExtensions
	{
		public static MvcExternalResources Resources(this HtmlHelper htmlHelper)
		{
			return GetInstance(htmlHelper);
		}

		public static MvcExternalResources GetInstance(HtmlHelper htmlHelper)
		{
			const string instanceKey = "ExternalResourcesInstance";

			var context = htmlHelper.ViewContext.HttpContext;
			if (context == null)
			{
				return null;
			}

			var helper = (MvcExternalResources)context.Items[instanceKey];

			if (helper == null)
			{
				context.Items.Add(instanceKey, helper = new MvcExternalResources());
			}
			return helper;
		}
	}

	public class MvcExternalResources
	{
		public const string StyleFormat = "<link href=\"{0}\" rel=\"stylesheet\" type=\"text/css\" />";
		public const string ScriptFormat = "<script src=\"{0}\" type=\"text/javascript\"></script>";

		public MvcExternalResources()
		{
			Styles = new ResourceRegistrar(StyleFormat);
			Scripts = new ResourceRegistrar(ScriptFormat);
		}

		public ResourceRegistrar Styles { get; private set; }
		public ResourceRegistrar Scripts { get; private set; }

	}

	public class ResourceRegistrar
	{
		private readonly string _format;
		private readonly IList<string> _items;

		public ResourceRegistrar(string format)
		{
			_format = format;
			_items = new List<string>();
		}

		public ResourceRegistrar Add(string url)
		{
			if (!_items.Contains(url))
			{
				_items.Add(url);
				//_items.Insert(0, url);
			}
			return this;
		}

		public ResourceRegistrar AddFirst(string url)
		{
			if (!_items.Contains(url))
			{
				_items.Insert(0, url);
			}
			return this;
		}

		public IHtmlString Render()
		{
			var builder = new StringBuilder();
			foreach (var item in _items)
			{
				var formattedString = string.Format(_format, item);
				builder.AppendLine(formattedString);
			}
			return new HtmlString(builder.ToString());
		}
	}

}