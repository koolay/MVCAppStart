using System;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Routing;
using App.WebUI.App_Start;
using ServiceStack.MiniProfiler;
using ServiceStack.Logging;
using ServiceStack.Logging.NLogger;
using ServiceStack.Common;

namespace App.WebUI
{
    public class MvcApplication : System.Web.HttpApplication
    {

        protected void Application_Start()
        {
            CryptUtils.Length = RsaKeyLengths.Bit1024;
            CryptUtils.KeyPair = CryptUtils.CreatePublicAndPrivateKeyPair();
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