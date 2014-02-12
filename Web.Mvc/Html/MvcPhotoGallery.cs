using System;
using System.Web.Mvc;
using System.Web.Routing;
using Web.Mvc.Extensions;
using Web.Mvc.Models;
using Infrastructure.Extensions;

namespace Web.Mvc.Html
{
	public static class MvcPhotoGalleryExtensions
	{
		public static MvcPhotoGallery PhotoGallery(this HtmlHelper helper)
		{
			return new MvcPhotoGallery(helper);
		}
	}

	public class MvcPhotoGallery
	{
		private HtmlHelper Helper { get; set; }
		private string Id { get; set; }
		private PhotoGalleryModel Gallery { get; set; }
		private RouteValueDictionary HtmlProperties { get; set; }
		private string SelectedItemCssClass { get; set; }
		private string ItemCssClass { get; set; }
		private string CssClass { get; set; }
		private string CssClassLandscape { get; set; }
		private string CssClassPortrait { get; set; }
		private string FirstItemCssClass { get; set; }
		private string LastItemCssClass { get; set; }

		public MvcPhotoGallery(HtmlHelper helper)
		{
			Helper = helper;
		}

		public MvcPhotoGallery ClientId(string clientId)
		{
			Id = clientId;
			return this;
		}

		public MvcPhotoGallery Bind(PhotoGalleryModel model)
		{
			Gallery = model;
			return this;
		}

		public MvcPhotoGallery HtmlAttributes(object dictionary)
		{
			HtmlProperties = new RouteValueDictionary(dictionary);
			return this;
		}

		public MvcPhotoGallery SetSelectedItemCssClass(string cssClass)
		{
			SelectedItemCssClass = cssClass;
			return this;
		}

		public MvcPhotoGallery SetItemCssClass(string cssClass)
		{
			ItemCssClass = cssClass;
			return this;
		}

		public MvcPhotoGallery SetCssClass(string cssClass)
		{
			CssClass = cssClass;
			return this;
		}

		public MvcPhotoGallery SetCssClassLandscape(string cssClass)
		{
			CssClassLandscape = cssClass;
			return this;
		}

		public MvcPhotoGallery SetCssClassPortrait(string cssClass)
		{
			CssClassPortrait = cssClass;
			return this;
		}

		public MvcPhotoGallery SetFirstItemCssClass(string cssClass)
		{
			FirstItemCssClass = cssClass;
			return this;
		}

		public MvcPhotoGallery SetLastItemCssClass(string cssClass)
		{
			LastItemCssClass = cssClass;
			return this;
		}

		public MvcHtmlString Render()
		{
			var ulTag = new TagBuilder("ul");
			ulTag.AddNotEmptyCssClass(CssClass);
			ulTag.GenerateId(Id);
			ulTag.MergeAttributes(HtmlProperties);
			if(Gallery != null && Gallery.Photos != null)
			{
				var itemNumber = 0;
				foreach (var photo in Gallery.Photos)
				{
					itemNumber++;
					var liTag = new TagBuilder("li");
					liTag.AddNotEmptyCssClass(ItemCssClass);
					if (itemNumber == 1)
					{
						liTag.AddNotEmptyCssClass(FirstItemCssClass);
					}
					if (itemNumber == Gallery.Photos.Count)
					{
						liTag.AddNotEmptyCssClass(LastItemCssClass);
					}
					var imgCssClass = (photo.Orientation == ImageOrientation.Landscape ? CssClassLandscape : CssClassPortrait);
					var link = Helper.ImageLink(
						String.Empty,
						Gallery.Path.Append(photo.ThumbnailSource, "/"),
						photo.AlternateText,
						new { @class = imgCssClass },
						String.Empty,
						Gallery.Path.Append(photo.Source, "/"),
						new { @target = "_blank", @rel = "photo-box" });
					liTag.InnerHtml = link.ToHtmlString();
					ulTag.InnerHtml += MvcHtmlString.Create(liTag.ToString(TagRenderMode.Normal));
				}
			}
			return MvcHtmlString.Create(ulTag.ToString(TagRenderMode.Normal));
		}
	}
}
