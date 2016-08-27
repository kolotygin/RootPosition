using System.Web.Mvc;
using System.Web.Routing;

namespace Root.Web.Mvc.Html
{
    public static class MvcImage
    {
        public static MvcHtmlString Image(this HtmlHelper helper, string id, string url, string alternateText)
        {
            return Image(helper, id, url, alternateText, null);
        }

        public static MvcHtmlString Image(this HtmlHelper helper, string id, string src, string alternateText, object htmlAttributes)
        {
            // Create tag builder
            var imgTag = new TagBuilder("img");

            // Create valid id
            imgTag.GenerateId(id);

            // Add attributes
            imgTag.MergeAttribute("src", helper.Url().Content(src));
            imgTag.MergeAttribute("alt", helper.Encode(alternateText));
            imgTag.MergeAttributes(new RouteValueDictionary(htmlAttributes), true);

            // Render tag
            return new MvcHtmlString(imgTag.ToString(TagRenderMode.SelfClosing));
        }

        public static MvcHtmlString ImageLink(this HtmlHelper helper, string imgId, string imgSrc, string imgAlternateText, object imgHtmlAttributes,
            string id, string actionName, string controllerName, object routeValues, object htmlAttributes)
        {
            var href = helper.Url().Action(actionName, controllerName, routeValues);
            return helper.ImageLink(imgId, imgSrc, imgAlternateText, imgHtmlAttributes, id, href, htmlAttributes);
        }

        public static MvcHtmlString ImageLink(this HtmlHelper helper, string imgId, string imgSrc, string imgAlternateText,
            object imgHtmlAttributes, string id, string href, object htmlAttributes)
        {
            var aTag = new TagBuilder("a");

            // Create valid id
            aTag.GenerateId(id);

            aTag.MergeAttribute("href", helper.Url().Content(href));
            aTag.InnerHtml = helper.Image(imgId, imgSrc, imgAlternateText, imgHtmlAttributes).ToString();
            aTag.MergeAttributes(new RouteValueDictionary(htmlAttributes), true);

            // Render tag
            return new MvcHtmlString(aTag.ToString(TagRenderMode.Normal));
        }

    }
}
