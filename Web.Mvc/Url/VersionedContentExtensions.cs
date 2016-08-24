using System;
using System.IO;
using System.Web;
using System.Web.Caching;
using System.Web.Hosting;
using System.Web.Mvc;

namespace Web.Mvc.Url
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
            var physicalPath = HostingEnvironment.MapPath(contentPath);

            if (!File.Exists(physicalPath))
            {
                return contentUrl;
            }
            var version = @"v=" + File.GetLastWriteTime(physicalPath).ToString(@"yyyyMMddhhmmss");

            var versionedContentUrl = contentPath.Contains(@"?") ? contentUrl + @"&" + version
                    : contentUrl + @"?" + version;

            return versionedContentUrl;
        }
    }
}
