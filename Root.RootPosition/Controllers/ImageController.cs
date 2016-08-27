using System.IO;
using System.Web.Hosting;
using System.Web.Mvc;
using Root.Infrastructure.Extensions;
using Root.Infrastructure.Imaging;
using Root.Web.Mvc;

namespace Root.RootPosition.Controllers
{
    public class ImageController : Controller
    {
        public ActionResult Render(string file)
        {
            var fullPath = HostingEnvironment.MapPath(file);
            if (!System.IO.File.Exists(fullPath))
            {
                return new HttpNotFoundResult($"The file {file} does not exist.");
            }
            return new ImagePathResult(fullPath, GetContentType(fullPath));
        }

        public ActionResult Resize(string file, int? width, int? height)
        {
            var fullPath = HostingEnvironment.MapPath(file);
            if (!System.IO.File.Exists(fullPath))
            {
                return new HttpNotFoundResult($"The file {file} does not exist.");
            }
            var stream = ImageResizer.Resize(fullPath, width, height, ImageResizeQuality.High);
            return new ImageStreamResult(stream, GetContentType(fullPath));
        }

        private static string GetFullPath(string virtualPath)
        {
            return HostingEnvironment.MapPath(virtualPath);
/*
            var fileName = file.EndsWith("/") ? file.Remove(file.Length - 1) : file;
            return string.Format("{0}\\{1}", Server.MapPath("~"), fileName);
*/
        }

        public static string GetContentType(string path)
        {
            switch (Path.GetExtension(path).TextOrEmpty().ToLower())
            {
                case ".bmp": return "image/bmp";
                case ".gif": return "image/gif";
                case ".jpg": return "image/jpeg";
                case ".png": return "image/png";
                default: break;
            }
            return string.Empty;
        }

    }

}
