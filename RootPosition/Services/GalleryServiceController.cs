using System;
using System.Collections;
using System.Collections.Generic;
using System.Drawing;
using System.Web.Hosting;
using System.IO;
using System.Web.UI.WebControls;
using Infrastructure.Imaging;
using Infrastructure.Extensions;
using Web.Mvc.Models;

namespace RootPosition.Services
{
    internal class DescendingComparer : IComparer<string>
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

    public class GalleryServiceController
    {
        public static SortedList<string, PhotoGalleryModel> GetGalleries(string virtualPath)
        {
            var physicalPath = HostingEnvironment.MapPath(virtualPath);
            var galleries = new SortedList<string, PhotoGalleryModel>(new DescendingComparer());
            var dir = new DirectoryInfo(physicalPath);
            foreach (var subDir in dir.GetDirectories("????-??-??"))
            {
                var gallery = new PhotoGalleryModel { Path = virtualPath + "/" + subDir.Name };
                galleries.Add(subDir.Name, gallery);
                foreach (var file in subDir.GetFiles("*.jpg"))
                {
                    var size = ImageHelper.GetDimensions(file.FullName);
                    gallery.Photos.Add(new PhotoModel { Source = gallery.Path + "/" + file.Name, Orientation = size.Orientation(), ThumbnailSize = new Size(120, 120) });
                }
            }
            return galleries;
        }

    }
}
