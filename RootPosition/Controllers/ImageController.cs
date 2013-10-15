using System.IO;
using System.Web.Mvc;
using Infrastructure.Imaging;
using Web.Mvc;

namespace RootPosition.Controllers
{
    public class ImageController : Controller
    {

        public ActionResult Render(string file)
        {
            var fullPath = GetFullPath(file);
            if (!System.IO.File.Exists(fullPath))
            {
                return new HttpNotFoundResult(string.Format("The file {0} does not exist.", file));
            }
            return new ImagePathResult(fullPath, GetContentType(fullPath));
        }

        public ActionResult Resize(string file, int? width, int? height)
        {
            var fullPath = GetFullPath(file);
            if (!System.IO.File.Exists(fullPath))
            {
                return new HttpNotFoundResult(string.Format("The file {0} does not exist.", file));
            }
            var stream = ImageResizer.Resize(fullPath, width, height, ImageResizeQuality.High);
            return new ImageStreamResult(stream, GetContentType(fullPath));
        }

        private string GetFullPath(string file)
        {
            var fileName = file.EndsWith("/") ? file.Remove(file.Length - 1) : file;
            return string.Format("{0}\\{1}", Server.MapPath("~/Content/Images"), fileName);
        }

        public static string GetContentType(string path)
        {
            switch (Path.GetExtension(path))
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
