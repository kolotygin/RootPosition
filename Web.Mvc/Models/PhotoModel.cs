using System;
using System.Drawing;

namespace Web.Mvc.Models
{
    public enum ImageOrientation
    {
        Undefined = 0,
        Landscape = 1,
        Portrait = 2
    }

    public class PhotoModel
    {
        public string Source;
        public string AlternateText;
        public ImageOrientation Orientation;
        public Size ThumbnailSize { get; set; }

        public string ThumbnailSource
        {
            get
            {
                return string.Format("Image/{0}/{1}/{2}", ThumbnailSize.Width, ThumbnailSize.Height, Source);
            }
        }

        public override string ToString()
        {
            return String.Format("{0} [{1}]", Source, AlternateText);
        }

    }
}
