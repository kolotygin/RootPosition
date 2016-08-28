using System.Web.Mvc;

namespace Root.RootPosition.Controllers
{
    public class MusicController : Controller
    {
        public ActionResult Index()
        {
            ViewBag.Title = "Why study music";
            return View();
        }
    }
}
