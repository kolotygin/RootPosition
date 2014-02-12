﻿using System;
using System.Collections;
using System.Collections.Generic;
using System.Web.Hosting;
using System.IO;
using System.Web.Mvc;
using Infrastructure.Extensions;
using Infrastructure.Imaging;
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

        private void GetImages(string path)
        {
            DirectoryInfo dir = new DirectoryInfo(path);
            foreach (FileInfo file in dir.GetFiles("*.jpg"))
            {
            }
        }

        public ActionResult Index()
		{
			ViewBag.Title = "Gallery";
			var model = new PhotoGalleryModel
			{
				Photos = new List<PhotoModel> {
					new PhotoModel { Source = "IMG_5198.jpg", Orientation = ImageOrientation.Landscape },
					new PhotoModel { Source = "IMG_5209.jpg", Orientation = ImageOrientation.Portrait },
					new PhotoModel { Source = "IMG_5214.jpg", Orientation = ImageOrientation.Landscape },
					new PhotoModel { Source = "IMG_5215.jpg", Orientation = ImageOrientation.Landscape },
					new PhotoModel { Source = "IMG_5221.jpg", Orientation = ImageOrientation.Landscape },
					new PhotoModel { Source = "IMG_5227.jpg", Orientation = ImageOrientation.Landscape },
					new PhotoModel { Source = "IMG_5232.jpg", Orientation = ImageOrientation.Portrait },
					new PhotoModel { Source = "IMG_5233.jpg", Orientation = ImageOrientation.Landscape },
					new PhotoModel { Source = "IMG_5245.jpg", Orientation = ImageOrientation.Portrait },
					new PhotoModel { Source = "IMG_5249.jpg", Orientation = ImageOrientation.Portrait },
					new PhotoModel { Source = "IMG_5262.jpg", Orientation = ImageOrientation.Portrait },
					new PhotoModel { Source = "IMG_5285.jpg", Orientation = ImageOrientation.Portrait },
					new PhotoModel { Source = "IMG_5286.jpg", Orientation = ImageOrientation.Portrait },
					new PhotoModel { Source = "IMG_5305.jpg", Orientation = ImageOrientation.Landscape },
					new PhotoModel { Source = "IMG_5313.jpg", Orientation = ImageOrientation.Portrait },
					new PhotoModel { Source = "IMG_5318.jpg", Orientation = ImageOrientation.Landscape },
					new PhotoModel { Source = "IMG_5325.jpg", Orientation = ImageOrientation.Landscape },
					new PhotoModel { Source = "IMG_5341.jpg", Orientation = ImageOrientation.Landscape },
					new PhotoModel { Source = "IMG_5350.jpg", Orientation = ImageOrientation.Portrait },
					new PhotoModel { Source = "IMG_5359.jpg", Orientation = ImageOrientation.Landscape },
					new PhotoModel { Source = "IMG_5368.jpg", Orientation = ImageOrientation.Landscape },
					new PhotoModel { Source = "IMG_5369.jpg", Orientation = ImageOrientation.Portrait },
					new PhotoModel { Source = "IMG_5377.jpg", Orientation = ImageOrientation.Landscape },
					new PhotoModel { Source = "IMG_5382.jpg", Orientation = ImageOrientation.Portrait },
					new PhotoModel { Source = "IMG_5388.jpg", Orientation = ImageOrientation.Portrait },
					new PhotoModel { Source = "IMG_9430.jpg", Orientation = ImageOrientation.Portrait },
				},
				Path = "~/PhotoGallery/2012-06-25",
			};
			var galleries = new SortedList<string, PhotoGalleryModel>(new DescendingComparer());

			//var fileName = Request.MapPath("~\\PhotoGallery\\2012-06-25\\IMG_9430.jpg");

            //var fileName = HostingEnvironment.MapPath(model.Path + "/" + model.Photos[0].PhotoSource);
			//var size = ImageHeader.GetDimensions(fileName);
			//var path = ServerExtensions.RelativePath("~\\PhotoGallery\\2012-06-25\\IMG_9430.jpg");

			var fileName = Request.MapPath(model.Path + "/" + model.Photos[0].Source);
			var size = ImageHelper.GetDimensions(fileName);
			var path = ServerExtensions.RelativePath("~\\PhotoGallery\\2012-06-25\\IMG_9430.jpg");

			return View(model);
		}
	}
}
