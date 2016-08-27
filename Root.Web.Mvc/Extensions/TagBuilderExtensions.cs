using System.Web.Mvc;

namespace Root.Web.Mvc.Extensions
{
    public static class TagBuilderExtensions
    {
        public static void AddNotEmptyCssClass(this TagBuilder builder, string cssClass)
        {
            if (!string.IsNullOrEmpty(cssClass))
            {
                builder.AddCssClass(cssClass);
            }
        }
    }
}
