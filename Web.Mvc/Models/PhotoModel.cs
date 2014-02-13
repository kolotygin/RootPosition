using System;
using System.Drawing;
using System.Web;
using System.Web.UI.WebControls;

namespace Web.Mvc.Models
{
/*
    public enum ImageOrientation
    {
        Undefined = 0,
        Landscape = 1,
        Portrait = 2
    }
*/

    public class PhotoModel
    {
        public string Source;
        public string AlternateText;
        public Orientation Orientation;
        public Size ThumbnailSize { get; set; }

        public string ThumbnailSource
        {
            get
            {
                return string.Format("~/Image/{0}/{1}/{2}", ThumbnailSize.Width, ThumbnailSize.Height, HttpContext.Current.Server.UrlEncode(Source));
            }
        }

        public string ImageSource
        {
            get
            {
                return string.Format("~/Image/{0}/{1}/{2}", 600, 600, HttpContext.Current.Server.UrlEncode(Source));
            }
        }

        public override string ToString()
        {
            return String.Format("{0} [{1}]", Source, AlternateText);
        }

    }
}
