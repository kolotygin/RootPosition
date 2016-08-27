using System;
using System.Web;
using System.Web.Caching;
using System.Web.Mvc;
using Root.Web.Url;

namespace Root.Web.Mvc.Url
{
    public static class VersionedContentExtensions
    {
        public static string VersionedContent(this UrlHelper helper, string contentPath)
        {
            var context = HttpContext.Current;

            if (context.Cache[contentPath] == null)
            {
                context.Cache.Add(contentPath, GetVersionedContentUrl(helper, contentPath), null,
                    DateTime.Now.AddMinutes(1), TimeSpan.Zero, CacheItemPriority.Normal, null);
            }
            return context.Cache[contentPath] as string;
        }

        private static string GetVersionedContentUrl(UrlHelper helper, string contentPath)
        {
            var contentUrl = helper.Content(contentPath);
            var version = CurrentApplication.GetVersion();
            if (!string.IsNullOrEmpty(version))
            {
                var webResourceUrl = new WebResourceUrl(contentUrl);
                webResourceUrl.Parameters.Add("ver", version);
                return webResourceUrl.ToPathAndQuery();
            }
            return contentUrl;
        }

    }
}
