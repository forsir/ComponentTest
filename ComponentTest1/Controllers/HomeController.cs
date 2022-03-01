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
            Page data = new("Test page",
                new List<Item>
                {
                    new TextItem("Text item", "anything"),
                    new CheckBoxItem( "Bool item", true),
                    new DatasetItem("List", "One",
                    new List<string>{ "One", "Two", "Three" })
                });

            //        Page data = new("Zkušební stránka",
            //    new List<ListPage> {
            //                new ListPage(
            //                    new List<Item>
            //                    {
            //                        new TextItem("Textová položka", "cokoliv"),
            //                        new CheckBoxItem( "Bool položka", true),
            //                        new DatasetItem("Seznam", "Jedna",
            //                        new List<string>{ "Jedna", "Dva", "Tři" })
            //                    }),
            //                new ListPage(
            //                    new List<Item>
            //                    {
            //                        new SelectItem("Textová položka"),
            //                        new SelectItem( "Bool položka"),
            //                        new SelectItem("Seznam")
            //                    }
            //                )
            //    }
            //);

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
