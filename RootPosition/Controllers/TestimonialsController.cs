﻿using System.Web.Mvc;

namespace RootPosition.Controllers
{
    public class TestimonialsController : Controller
    {
        public ActionResult Index()
        {
            ViewBag.Title = "Testimonials";
            return View();
        }
    }
}
