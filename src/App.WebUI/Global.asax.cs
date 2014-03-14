using System;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Routing;
using App.WebUI.App_Start;
using ServiceStack.MiniProfiler;
using ServiceStack.Logging;
using ServiceStack.Logging.NLogger;

namespace App.WebUI
{
    public class MvcApplication : System.Web.HttpApplication
    {

        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();
            
            WebApiConfig.Register(GlobalConfiguration.Configuration);
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
        }

        protected void Application_BeginRequest(object sender, EventArgs e)
        {

            if (Request.IsLocal)
                Profiler.Start();
        }

        protected void Application_EndRequest(object src, EventArgs e)
        {
            Profiler.Stop();
        }

    }
}