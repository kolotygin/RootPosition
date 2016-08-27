using System.Web.Mvc;

namespace Root.RootPosition.Controllers
{
    public class VoiceController : Controller
    {
        public ActionResult Index()
        {
            ViewBag.Title = "Voice";
            return View();
        }
    }
}
