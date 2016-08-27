using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Web;
using System.Web.Mvc;
using System.Web.Mvc.Html;
using System.Web.Routing;

namespace Web.Mvc.Html
{
	public static class MvcUl
	{
		public static MvcHtmlString Ul<T>(this HtmlHelper helper, string id, string cssClass, string alternateText, object htmlAttributes, string itemCssClass, IList<T> items, Func<T, IHtmlString> itemContent)
		{
//			// Create tag builder
//			var imgTag = new TagBuilder("img");
//
//			// Create valid id
//			imgTag.GenerateId(id);
//
//			// Add attributes
//			imgTag.MergeAttribute("src", helper.Url().Content(src));
//			imgTag.MergeAttribute("alt", helper.Encode(alternateText));
//			imgTag.MergeAttributes(new RouteValueDictionary(htmlAttributes), true);
//
//			// Render tag
//			return new MvcHtmlString(imgTag.ToString(TagRenderMode.Normal));
			SelectExtensions.DropDownList()
			helper.DropDownList().
			var ulTag = new TagBuilder("ul");
			ulTag.GenerateId(id);
			ulTag.AddCssClass(cssClass);
			ulTag.MergeAttributes(new RouteValueDictionary(htmlAttributes), true);
			var itemNumber = 0;
			foreach (T item in items)
			{
				itemNumber++;
				var liTag = new TagBuilder("li");
				liTag.AddCssClass(itemCssClass);
				if (Menu.IsSelected(item))
				{
					liTag.AddCssClass(SelectedItemCssClass);
				}
				if (itemNumber == 1)
				{
					liTag.AddCssClass("first");
				}
				if (itemNumber == items.Count)
				{
					liTag.AddCssClass("last");
				}
				liTag.InnerHtml = itemContent(item).ToHtmlString();

				//if (string.IsNullOrEmpty(item.ClientCallbackMethod))
				//{
				//    liTag.InnerHtml = System.Web.Mvc.Html.LinkExtensions.ActionLink(Helper, item.Text, item.Url.ActionName, item.Url.ControllerName ?? string.Empty).ToHtmlString();
				//}
				//else
				//{
				//    // see http://stackoverflow.com/questions/134845/href-tag-for-javascript-links-or-javascriptvoid0
				//    liTag.InnerHtml = string.Format("<a onclick=\"{1}\">{0}</a>", item.Text, item.ClientCallbackMethod);
				//}

				ulTag.InnerHtml += liTag.ToString();
			}
			return MvcHtmlString.Create(ulTag.ToString(TagRenderMode.Normal));

		}

	}
}
