using System;
using System.Web.Mvc;

namespace Web.Mvc.Extensions
{
	public static class TagBuilderExtensions
	{
		public static void AddNotEmptyCssClass(this TagBuilder builder, string cssClass)
		{
			if (!String.IsNullOrEmpty(cssClass))
			{
				builder.AddCssClass(cssClass);
			}
		}
	}
}
