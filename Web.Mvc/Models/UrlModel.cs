using System;
using Infrastructure.Extensions;

namespace Web.Mvc.Models
{
	public class UrlModel
	{
		public string ControllerName { get; set; }
		public string ActionName { get; set; }
		public string AreaName { get; set; }

		public override bool Equals(object obj)
		{
			if(obj == null || obj.GetType() != typeof(UrlModel))
			{
				return Equals((UrlModel)obj);
			}
			return false;
		}

		public bool Equals(UrlModel urlModel)
		{
			if(urlModel == null)
			{
				return false;
			}

			return (((String.IsNullOrEmpty(AreaName) && String.IsNullOrEmpty(urlModel.AreaName)) || (String.Equals(AreaName, urlModel.AreaName, StringComparison.InvariantCultureIgnoreCase))) &&
				((String.IsNullOrEmpty(ControllerName)) || (ControllerName.Equals(urlModel.ControllerName, StringComparison.InvariantCultureIgnoreCase)) &&
				((ActionName == null) || ActionName.Equals(urlModel.ActionName, StringComparison.InvariantCultureIgnoreCase))));
		}

		public override int GetHashCode()
		{
			return ActionName.GetTextOrEmpty().GetHashCode() ^ ControllerName.GetTextOrEmpty().GetHashCode() ^ AreaName.GetTextOrEmpty().GetHashCode();
		}

		public override string ToString()
		{
			return String.Format("ActionName: {0}; ControllerName: {1}; AreaName: {2}", ActionName, ControllerName, AreaName);
		}

		public string AsId()
		{
			return ControllerName.Append(ActionName, "-").GetTextOrEmpty().ToLower();
		}
	}

}
