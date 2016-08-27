using System;
using System.Web;
using System.Web.UI.WebControls;

namespace Root.Web.Mvc.Models
{

    public class PhotoModel
    {
        private readonly string _source;

        public PhotoModel(string source, Orientation orientation)
        {
            _source = source;
            Orientation = orientation;
        }

        //public string Source;
        //public string AlternateText;
        //public Size ThumbnailSize { get; set; }

        public string Source => HttpContext.Current.Server.UrlEncode(_source);

        public Orientation Orientation { get; }

/*
        public string ThumbnailSource
        {
            get
            {
                return VirtualPathUtility.ToAbsolute(string.Format("~/Image/{0}/{1}/{2}", ThumbnailSize.Width, ThumbnailSize.Height, HttpContext.Current.Server.UrlEncode(Source)));
            }
        }

        public string ImageSource
        {
            get
            {
                return VirtualPathUtility.ToAbsolute(string.Format("~/Image/{0}/{1}/{2}", 600, 600, HttpContext.Current.Server.UrlEncode(Source)));
            }
        }

        public bool Portrait
        {
            get
            {
                return Orientation == Orientation.Vertical;
            }
        }
*/

        public override string ToString()
        {
            return $"{Source} [{Orientation}]";
        }

    }
}
