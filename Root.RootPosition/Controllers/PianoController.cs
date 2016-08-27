using System.Web.Mvc;

namespace Root.RootPosition.Controllers
{
    public class PianoController : Controller
    {
        public ActionResult Index()
        {
            ViewBag.Title = "Piano";
            return View();
        }
    }
}
