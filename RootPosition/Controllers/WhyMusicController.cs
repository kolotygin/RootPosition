using System.Web.Mvc;

namespace RootPosition.Controllers
{
    public class WhyMusicController : Controller
    {
        public ActionResult Index()
        {
			ViewBag.Title = "Why Study Music?";
            return View();
        }
    }
}
