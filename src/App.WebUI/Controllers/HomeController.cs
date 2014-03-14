using System.Web.Mvc;
using ServiceStack.MiniProfiler;

using App.Models.Home;
using App.Entities;

namespace App.WebUI.Controllers
{
    public class HomeController:AppControllerBase
    {
        public ActionResult Index()
        {
            this.CurProfiler.Step("GetLatest", ProfileLevel.Info);     
            Logger.Info("index page");
             
            var model = new IndexModel()
            {
                Subject = "Hello, world",
                TopNavData = new TopNavModel()
                {
                    IsLogined = true,
                    UserInfo = new Account()
                    {
                        Id = 1,
                        UserName = "koo",
                        Password = ""
                    }
                }
            };
            return View(model);
        }
    }
}
