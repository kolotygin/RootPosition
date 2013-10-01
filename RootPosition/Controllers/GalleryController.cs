using System;
using System.Collections;
using System.Collections.Generic;
using System.ComponentModel;
using System.Web.Mvc;
using Infrastructure.Extensions;
using Infrastructure.Image;
using Web.Mvc.Models;

namespace RootPosition.Controllers
{
	public class DescendingComparer : IComparer<string>
	{
		public int Compare(string x, string y)
		{
			try
			{
				return String.Compare(x, y, StringComparison.CurrentCultureIgnoreCase) * -1;
			}
			catch (Exception)
			{
				return Comparer.DefaultInvariant.Compare(x, y);
			}
		}
	}
	public class GalleryController : Controller
	{
		public ActionResult Index()
		{
			ViewBag.Title = "Gallery";
			var model = new PhotoGalleryModel
			{
				Photos = new List<PhotoModel> {
					new PhotoModel { PhotoSource = "IMG_5198.jpg", ThumbnailOrientation = PhotoOrientation.Landscape },
					new PhotoModel { PhotoSource = "IMG_5209.jpg", ThumbnailOrientation = PhotoOrientation.Portrait },
					new PhotoModel { PhotoSource = "IMG_5214.jpg", ThumbnailOrientation = PhotoOrientation.Landscape },
					new PhotoModel { PhotoSource = "IMG_5215.jpg", ThumbnailOrientation = PhotoOrientation.Landscape },
					new PhotoModel { PhotoSource = "IMG_5221.jpg", ThumbnailOrientation = PhotoOrientation.Landscape },
					new PhotoModel { PhotoSource = "IMG_5227.jpg", ThumbnailOrientation = PhotoOrientation.Landscape },
					new PhotoModel { PhotoSource = "IMG_5232.jpg", ThumbnailOrientation = PhotoOrientation.Portrait },
					new PhotoModel { PhotoSource = "IMG_5233.jpg", ThumbnailOrientation = PhotoOrientation.Landscape },
					new PhotoModel { PhotoSource = "IMG_5245.jpg", ThumbnailOrientation = PhotoOrientation.Portrait },
					new PhotoModel { PhotoSource = "IMG_5249.jpg", ThumbnailOrientation = PhotoOrientation.Portrait },
					new PhotoModel { PhotoSource = "IMG_5262.jpg", ThumbnailOrientation = PhotoOrientation.Portrait },
					new PhotoModel { PhotoSource = "IMG_5285.jpg", ThumbnailOrientation = PhotoOrientation.Portrait },
					new PhotoModel { PhotoSource = "IMG_5286.jpg", ThumbnailOrientation = PhotoOrientation.Portrait },
					new PhotoModel { PhotoSource = "IMG_5305.jpg", ThumbnailOrientation = PhotoOrientation.Landscape },
					new PhotoModel { PhotoSource = "IMG_5313.jpg", ThumbnailOrientation = PhotoOrientation.Portrait },
					new PhotoModel { PhotoSource = "IMG_5318.jpg", ThumbnailOrientation = PhotoOrientation.Landscape },
					new PhotoModel { PhotoSource = "IMG_5325.jpg", ThumbnailOrientation = PhotoOrientation.Landscape },
					new PhotoModel { PhotoSource = "IMG_5341.jpg", ThumbnailOrientation = PhotoOrientation.Landscape },
					new PhotoModel { PhotoSource = "IMG_5350.jpg", ThumbnailOrientation = PhotoOrientation.Portrait },
					new PhotoModel { PhotoSource = "IMG_5359.jpg", ThumbnailOrientation = PhotoOrientation.Landscape },
					new PhotoModel { PhotoSource = "IMG_5368.jpg", ThumbnailOrientation = PhotoOrientation.Landscape },
					new PhotoModel { PhotoSource = "IMG_5369.jpg", ThumbnailOrientation = PhotoOrientation.Portrait },
					new PhotoModel { PhotoSource = "IMG_5377.jpg", ThumbnailOrientation = PhotoOrientation.Landscape },
					new PhotoModel { PhotoSource = "IMG_5382.jpg", ThumbnailOrientation = PhotoOrientation.Portrait },
					new PhotoModel { PhotoSource = "IMG_5388.jpg", ThumbnailOrientation = PhotoOrientation.Portrait },
					new PhotoModel { PhotoSource = "IMG_9430.jpg", ThumbnailOrientation = PhotoOrientation.Portrait },
				},
				Path = "~/PhotoGallery/2012-06-25",
			};
			var galleries = new SortedList<string, PhotoGalleryModel>(new DescendingComparer());

			var fileName = Request.MapPath("~\\PhotoGallery\\2012-06-25\\IMG_9430.jpg");
			var size = ImageHeader.GetDimensions(fileName);
			var path = ServerExtensions.RelativePath("~\\PhotoGallery\\2012-06-25\\IMG_9430.jpg");
			return View(model);
		}
	}
}
