using System;
using System.Web.Mvc;
using System.Web.Mvc.Html;
using System.Web.Routing;
using Web.Mvc.Extensions;
using Web.Mvc.Models;

namespace Web.Mvc.Html
{
	public static class MvcMenuExtensions
	{
		public static MvcMenu Menu(this HtmlHelper helper)
		{
			return new MvcMenu(helper);
		}
	}

	public class MvcMenu
	{
		private HtmlHelper Helper { get; set; }
		private string Id { get; set; }
		private MenuModel Menu { get; set; }
		private RouteValueDictionary HtmlProperties { get; set; }
		private string SelectedItemCssClass { get; set; }
		private string ItemCssClass { get; set; }
		private string FirstItemCssClass { get; set; }
		private string LastItemCssClass { get; set; }
		private string CssClass { get; set; }

		public MvcMenu(HtmlHelper helper)
		{
			Helper = helper;
		}

		public MvcMenu ClientId(string clientId)
		{
			Id = clientId;
			return this;
		}

		public MvcMenu Bind(MenuModel model)
		{
			Menu = model;
			return this;
		}

		public MvcMenu HtmlAttributes(object dictionary)
		{
			HtmlProperties = new RouteValueDictionary(dictionary);
			return this;
		}

		public MvcMenu SetSelectedItemCssClass(string cssClass)
		{
			SelectedItemCssClass = cssClass;
			return this;
		}

		public MvcMenu SetItemCssClass(string cssClass)
		{
			ItemCssClass = cssClass;
			return this;
		}

		public MvcMenu SetFirstItemCssClass(string cssClass)
		{
			FirstItemCssClass = cssClass;
			return this;
		}

		public MvcMenu SetLastItemCssClass(string cssClass)
		{
			LastItemCssClass = cssClass;
			return this;
		}

		public MvcMenu SetCssClass(string cssClass)
		{
			CssClass = cssClass;
			return this;
		}

		public MvcHtmlString Render()
		{
			var ulTag = new TagBuilder("ul");
			ulTag.AddNotEmptyCssClass(CssClass);
			ulTag.GenerateId(Id);
			ulTag.MergeAttributes(HtmlProperties);
			var itemNumber = 0;
			foreach (var item in Menu.Items)
			{
				itemNumber++;
				var liTag = new TagBuilder("li");
				liTag.AddNotEmptyCssClass(ItemCssClass);
				if (Menu.IsSelected(item))
				{
					liTag.AddNotEmptyCssClass(SelectedItemCssClass);
				}
				if (itemNumber == 1)
				{
					liTag.AddNotEmptyCssClass(FirstItemCssClass);
				}
				if (itemNumber == Menu.Items.Count)
				{
					liTag.AddNotEmptyCssClass(LastItemCssClass);
				}
				if (string.IsNullOrEmpty(item.OnClick))
				{
					liTag.InnerHtml = Helper.ActionLink(item.Text, item.Url.ActionName, item.Url.ControllerName ?? string.Empty).ToHtmlString();
				}
				else
				{
					// see http://stackoverflow.com/questions/134845/href-tag-for-javascript-links-or-javascriptvoid0
					liTag.InnerHtml = MvcHtmlString.Create(String.Format("<a onclick=\"{1}\">{0}</a>", item.Text, item.OnClick)).ToHtmlString();
				}
				ulTag.InnerHtml += MvcHtmlString.Create(liTag.ToString(TagRenderMode.Normal));
			}
			return MvcHtmlString.Create(ulTag.ToString(TagRenderMode.Normal));
		}
	}
}
