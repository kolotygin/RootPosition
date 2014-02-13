using System.Web.Mvc;
using RootPosition.Services;

namespace RootPosition.Controllers
{

    public class GalleryController : Controller
    {

        public ActionResult Index()
        {
            ViewBag.Title = "Gallery";
            var model = GalleryServiceController.GetGalleries("~/PhotoGallery");

            //var fileName = Request.MapPath("~\\PhotoGallery\\2012-06-25\\IMG_9430.jpg");

            //var fileName = HostingEnvironment.MapPath(model.Path + "/" + model.Photos[0].PhotoSource);
            //var size = ImageHeader.GetDimensions(fileName);
            //var path = ServerExtensions.RelativePath("~\\PhotoGallery\\2012-06-25\\IMG_9430.jpg");

            //var fileName = HostingEnvironment.MapPath(model.Path + "/" + model.Photos[0].Source);
            //var size = ImageHelper.GetDimensions(fileName);
            //var path = ServerExtensions.RelativePath("~\\PhotoGallery\\2012-06-25\\IMG_9430.jpg");

            return View(model);
        }
    }
}
