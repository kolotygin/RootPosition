using System.Drawing;
using System.Web.UI.WebControls;

namespace Root.Web.Extensions
{
    public static class SizeExtensions
    {
        public static Orientation Orientation(this Size size)
        {
            return size.Width > size.Height
                ? System.Web.UI.WebControls.Orientation.Horizontal
                : System.Web.UI.WebControls.Orientation.Vertical;
        }
    }
}
