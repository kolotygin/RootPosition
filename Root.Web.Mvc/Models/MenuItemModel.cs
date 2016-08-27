using System;

namespace Root.Web.Mvc.Models
{
    public class MenuItemModel
    {
        public string Text { get; set; }
        public string Id { get; set; }
        public UrlModel Url { get; set; }
        public string OnClick { get; set; }

        public MenuItemModel(string text, UrlModel url, string onClick)
            : this()
        {
            Text = text;
            Url = url;
            OnClick = onClick;
        }

        public MenuItemModel(string text, UrlModel url)
            : this()
        {
            Text = text;
            Url = url;
        }

        public MenuItemModel(string text, string onClick)
            : this()
        {
            Text = text;
            OnClick = onClick;
        }

        public MenuItemModel(string text)
            : this()
        {
            Text = text;
        }

        public MenuItemModel()
        {
            Text = string.Empty;
            Url = new UrlModel { ActionName = string.Empty, ControllerName = string.Empty };
            OnClick = string.Empty;
        }

        public override string ToString()
        {
            return $"{Text} [{Id}]";
        }
    }
}
