using System;
using System.Collections;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Web.Hosting;
using Root.Infrastructure.Imaging;
using Root.Web.Extensions;
using Root.Web.Mvc.Models;

namespace Root.RootPosition.Services
{
    internal class DescendingComparer : IComparer<string>
    {
        public int Compare(string x, string y)
        {
            try
            {
                return string.Compare(x, y, StringComparison.CurrentCultureIgnoreCase) * -1;
            }
            catch (Exception)
            {
                return Comparer.DefaultInvariant.Compare(x, y);
            }
        }
    }

    public class GalleryServiceController
    {
        public static IList<PhotoGalleryModel> GetGalleries(string virtualPath)
        {
            var physicalPath = HostingEnvironment.MapPath(virtualPath);
            var galleries = new SortedList<string, PhotoGalleryModel>(new DescendingComparer());
            var dir = new DirectoryInfo(physicalPath);
            foreach (var subDir in dir.GetDirectories("????-??-??"))
            {
                DateTime galleryDate;
                DateTime.TryParseExact(subDir.Name, "yyyy-MM-dd", CultureInfo.InvariantCulture, DateTimeStyles.None, out galleryDate);
                var gallery = new PhotoGalleryModel(virtualPath + "/" + subDir.Name, galleryDate);
                galleries.Add(subDir.Name, gallery);
                foreach (var file in subDir.GetFiles("*.jpg"))
                {
                    var size = ImageHelper.GetDimensions(file.FullName);
                    gallery.Photos.Add(new PhotoModel(file.Name, size.Orientation()));
                }
            }
            return galleries.Values;
        }

    }
}
