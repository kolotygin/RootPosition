using System.Web;

namespace Root.Web.Mvc
{
    public static class MvcApplication
    {
        public static string GetVersion()
        {
            var context = HttpContext.Current;

            if (context == null)
            {
                return null;
            }

            if (context.Cache["ApplicationVersion"] == null)
            {
                var instance = context.ApplicationInstance;
                var memberInfo = instance.GetType().BaseType;
                var version = (memberInfo != null) ? memberInfo.Assembly.GetName().Version : null;
                context.Cache["ApplicationVersion"] = (version != null) ? $"{version.Major}-{version.Minor}-{version.Build}-{version.Revision}" : string.Empty;
            }
            return context.Cache["ApplicationVersion"] as string;
        }
    }
}
