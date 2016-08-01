using System.Collections.Generic;
using System.Web.Mvc;
using Web.Mvc.Models;

namespace RootPosition.Controllers
{
    public class MenuController : Controller
    {

        [ChildActionOnly]
        public PartialViewResult Menu(UrlModel selectedUrl)
        {
            var model = new MenuModel
            {
                Items = new List<MenuItemModel> {
                    new MenuItemModel { Text = "Home", Url = new UrlModel { ActionName = "Index", ControllerName = "Home" }},
                    new MenuItemModel { Text = "About", Url = new UrlModel { ActionName = "Index", ControllerName = "About" }},
                    new MenuItemModel { Text = "Piano", Url = new UrlModel { ActionName = "Index", ControllerName = "Piano" }},
                    new MenuItemModel { Text = "Voice", Url = new UrlModel { ActionName = "Index", ControllerName = "Voice" }},
                    new MenuItemModel { Text = "Gallery",  Url = new UrlModel { ActionName = "Index", ControllerName = "Gallery" }},
                    new MenuItemModel { Text = "Testimonials", Url = new UrlModel { ActionName = "Index", ControllerName = "Testimonials" }},
                    new MenuItemModel { Text = "Contacts", Url = new UrlModel { ActionName = "Index", ControllerName = "Contacts" }}
                },
                SelectedItem = selectedUrl
            };
            return PartialView(model);
        }
    }
}
