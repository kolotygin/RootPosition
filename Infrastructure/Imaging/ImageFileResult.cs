using System.IO;
using System.Web;
using System.Web.Caching;
using System.Web.Mvc;

namespace Infrastructure.Imaging
{

    internal static class ImageCacheability
    {
        internal static void SetCacheability(HttpResponseBase response)
        {
            var cachePolicy = response.Cache;
            cachePolicy.SetCacheability(HttpCacheability.Public);
            cachePolicy.SetExpires(Cache.NoAbsoluteExpiration);
            cachePolicy.SetValidUntilExpires(true);
            cachePolicy.SetLastModifiedFromFileDependencies();
        }
    }

    public class ImagePathResult : FilePathResult
    {
        public ImagePathResult(string imagePath, string contentType) :
            base(imagePath, contentType)
        {
        }

        protected override void WriteFile(HttpResponseBase response)
        {
            //ImageCacheability.SetCacheability(response);
            base.WriteFile(response);
        }

    }

    public class ImageStreamResult : FileStreamResult
    {
        public ImageStreamResult(Stream image, string contentType) :
            base(image, contentType)
        {
        }

        protected override void WriteFile(HttpResponseBase response)
        {
            //ImageCacheability.SetCacheability(response);
            base.WriteFile(response);
        }

    }

}
