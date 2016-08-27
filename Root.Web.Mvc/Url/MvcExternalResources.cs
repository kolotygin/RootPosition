using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Optimization;
using Root.Infrastructure.Collections;

namespace Root.Web.Mvc.Url
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
        public MvcExternalResources(UrlHelper helper)
        {
            Styles = new StyleRenderer(helper);
            Scripts = new ScriptRenderer(helper);
        }

        public StyleRenderer Styles { get; private set; }
        public ScriptRenderer Scripts { get; private set; }
    }

    public class ScriptRenderer
    {
        private readonly UrlHelper _helper;
        private readonly OrderedSet<string> _paths;

        public ScriptRenderer(UrlHelper helper)
        {
            _paths = new OrderedSet<string>();
            _helper = helper;
        }

        public ScriptRenderer Add(string path)
        {
            _paths.Add(path);
            return this;
        }

        public ScriptRenderer AddFirst(string path)
        {
            _paths.AddFirst(path);
            return this;
        }

        public IHtmlString Render()
        {
            return Scripts.Render(_paths.AsEnumerable().Select(path => _helper.VersionedContent(path)).ToArray());
        }
    }

    public class StyleRenderer
    {
        private readonly UrlHelper _helper;
        private readonly OrderedSet<string> _paths;

        public StyleRenderer(UrlHelper helper)
        {
            _paths = new OrderedSet<string>();
            _helper = helper;
        }

        public StyleRenderer Add(string path)
        {
            _paths.Add(path);
            return this;
        }

        public StyleRenderer AddFirst(string path)
        {
            _paths.AddFirst(path);
            return this;
        }

        public IHtmlString Render()
        {
            return Styles.Render(_paths.AsEnumerable().Select(path => _helper.VersionedContent(path)).ToArray());
        }
    }

}
