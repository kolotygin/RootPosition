using System;
using Root.Infrastructure.Extensions;

namespace Root.Web.Mvc.Models
{
    public class UrlModel
    {
        public string ControllerName { get; set; }
        public string ActionName { get; set; }
        public string AreaName { get; set; }

        public override bool Equals(object obj)
        {
            if (obj == null || obj.GetType() != typeof(UrlModel))
            {
                return false;
            }
            return Equals((UrlModel)obj);
        }

        public bool Equals(UrlModel urlModel)
        {
            if (urlModel == null)
            {
                return false;
            }

            return (((String.IsNullOrEmpty(AreaName) && String.IsNullOrEmpty(urlModel.AreaName)) || (String.Equals(AreaName, urlModel.AreaName, StringComparison.InvariantCultureIgnoreCase))) &&
                ((String.IsNullOrEmpty(ControllerName)) || (ControllerName.Equals(urlModel.ControllerName, StringComparison.InvariantCultureIgnoreCase)) &&
                ((ActionName == null) || ActionName.Equals(urlModel.ActionName, StringComparison.InvariantCultureIgnoreCase))));
        }

        public override int GetHashCode()
        {
            return ActionName.TextOrEmpty().GetHashCode() ^ ControllerName.TextOrEmpty().GetHashCode() ^ AreaName.TextOrEmpty().GetHashCode();
        }

        public override string ToString()
        {
            return String.Format("ActionName: {0}; ControllerName: {1}; AreaName: {2}", ActionName, ControllerName, AreaName);
        }

        public string AsId()
        {
            return ControllerName.Append(ActionName, "-").TextOrEmpty().ToLower();
        }
    }

}
