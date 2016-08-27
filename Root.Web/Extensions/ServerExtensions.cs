using System.Web;
using Root.Infrastructure.Extensions;

namespace Root.Web.Extensions
{
    public static class ServerExtensions
    {
        public static string RelativePath(string absolutePath)
        {
            return absolutePath.Replace(HttpContext.Current.Request.ServerVariables["APPL_PHYSICAL_PATH"], "~/").Replace(@"\", "/");
        }

        public static string MapPathReverse(string absolutePath)
        {
            return @"~\" + absolutePath.Replace(HttpContext.Current.Request.PhysicalApplicationPath.TextOrEmpty(), string.Empty);
        }

        static string GetVirtualPath(string absolutePath)
        {
            var request = HttpContext.Current.Request;
            var applicationPath = request.PhysicalApplicationPath.TextOrEmpty();
            var virtualDir = request.ApplicationPath;
            virtualDir = virtualDir == "/" ? virtualDir : (virtualDir + "/");
            return absolutePath.Replace(applicationPath, virtualDir).Replace(@"\", "/");
        }

    }
}
