using System.Web.Mvc;

namespace RootPosition.Controllers
{
    public class HomeController : Controller
    {
        public ViewResult Index()
        {
            ViewBag.Title = "Piano & Voice Lessons";
            return View();
        }
    }
}
