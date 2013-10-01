using System.Web.Mvc;

namespace RootPosition.Controllers
{
    public class ContactsController : Controller
    {
        public ActionResult Index()
        {
            ViewBag.Title = "Contacts";
            return View();
        }
    }
}
