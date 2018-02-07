using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;

namespace KaraokeAPI.Controllers
{
    public class HomeController : Controller
    {
        public IActionResult Index()
        {            
            ViewBag.Admin = HttpContext.Session.GetString("Admin");            
            return View();
        }
    }
}
