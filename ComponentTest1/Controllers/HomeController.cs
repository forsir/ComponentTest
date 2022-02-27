using ComponentTest1.Models;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;

namespace ComponentTest1.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;

        public HomeController(ILogger<HomeController> logger)
        {
            _logger = logger;
        }

        public IActionResult Index()
        {
            Page? data = new Page()
            {
                Header = new Header() { Title = "Zkušební stránka" },
                List = new ListPage()
                {
                    Items = new List<Item>
                    {
                        new TextItem(){ Description="Textová položka", Value="cokoliv" },
                        new CheckBoxItem(){ Description="Bool položka", Value =true},
                        new DatasetItem(){ Description="Seznam", Value="Jedna",
                        Values=new List<string>{
                        "Jedna", "Dva", "Tři"
                        }
                    }
                }
                }
            };

            return View(data);
        }

        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
