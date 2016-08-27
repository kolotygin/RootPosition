using System.Collections.Generic;

namespace Root.Web.Mvc.Models
{
    public class MenuModel
    {
        public List<MenuItemModel> Items { get; set; }
        public UrlModel SelectedItem { get; set; }

        public bool IsSelected(MenuItemModel menuItem)
        {
            return SelectedItem != null && SelectedItem.Equals(menuItem.Url);
        }
    }
}
