using System.Collections.Generic;
using System.Text;
using System.Web;
using System.Web.Mvc;

namespace Web.Mvc.Html
{
    public static class MvcExternalResourcesExtensions
    {
        public static MvcExternalResources Resources(this HtmlHelper helper)
        {
            return GetInstance(helper);
        }

        public static MvcExternalResources GetInstance(HtmlHelper helper)
        {
            const string instanceKey = "ExternalResourcesInstance";

            /*var context = htmlHelper.ViewContext.HttpContext;*/
            var context = HttpContext.Current;
            if (context == null)
            {
                return null;
            }

            var instance = (MvcExternalResources)context.Items[instanceKey];

            if (instance == null)
            {
                context.Items.Add(instanceKey, instance = new MvcExternalResources());
            }
            return instance;
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
