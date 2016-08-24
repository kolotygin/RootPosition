using System.Collections.Generic;
using System.Text;
using System.Web;
using System.Web.Mvc;

namespace Web.Mvc.Url
{
    public static class MvcExternalResourcesExtensions
    {
        public static MvcExternalResources Resources(this UrlHelper helper)
        {
            return GetInstance(helper);
        }

        public static MvcExternalResources GetInstance(UrlHelper helper)
        {
            const string instanceKey = "ExternalResourcesInstance";

            var context = HttpContext.Current;
            if (context == null)
            {
                return null;
            }

            var instance = (MvcExternalResources)context.Items[instanceKey];

            if (instance == null)
            {
                context.Items.Add(instanceKey, instance = new MvcExternalResources(helper));
            }
            return instance;
        }
    }

    public class MvcExternalResources
    {
        public const string StyleFormat = "<link href=\"{0}\" rel=\"stylesheet\" type=\"text/css\" />";
        public const string ScriptFormat = "<script src=\"{0}\" type=\"text/javascript\"></script>";

        public MvcExternalResources(UrlHelper helper)
        {
            Styles = new ResourceRegistrar(helper, StyleFormat);
            Scripts = new ResourceRegistrar(helper, ScriptFormat);
        }

        public ResourceRegistrar Styles { get; private set; }
        public ResourceRegistrar Scripts { get; private set; }

    }

    public class ResourceRegistrar
    {
        private readonly string _format;
        private readonly IList<string> _items;
        private readonly UrlHelper _helper;

        public ResourceRegistrar(UrlHelper helper, string format)
        {
            _helper = helper;
            _format = format;
            _items = new List<string>();
        }

        public ResourceRegistrar Add(string url)
        {
            if (!_items.Contains(url))
            {
                _items.Add(url);
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
                var formattedString = string.Format(_format, _helper.VersionedContent(item));
                builder.AppendLine(formattedString);
            }
            return new HtmlString(builder.ToString());
        }
    }

}
