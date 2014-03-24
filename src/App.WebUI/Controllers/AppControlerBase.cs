using System;
using System.Web.Mvc;
using App.ServicesInterface.Common;
using ServiceStack.Logging;
using ServiceStack.MiniProfiler;
using ServiceStack.Mvc.MiniProfiler;
using ServiceStack.Mvc;
using App.Filters;
using App.Extensions;
using App.ServicesInterface;
using App.Utils;

namespace App.WebUI.Controllers
{
    [HandleErrorLog(View = "Errors/500")]
    [ProfilingActionFilter]
    public abstract class AppControllerBase : ServiceStackController<CustomUserSession>
    {
        public static AppConfig AppConfig { get; set; }
        public static readonly ILog Logger = LogManager.GetLogger(typeof(AppControllerBase));
        protected Profiler CurProfiler = Profiler.Current;
        public  ILoginService LoginService { get;  set; }

        public override string LoginRedirectUrl
        {
            get { return "/passport/login?next={0}"; }
        }

        public RedirectResult RedirectNext(string next, string defaultUrl="/")
        {
            string returnUrl = next ?? defaultUrl;
            return Redirect(Url.Content(returnUrl));
        }

        public void FlashModelStatusError()
        {
            foreach (var state in ModelState.Values)
            {
                if (state.Errors.Count > 0)
                {
                    this.Flash(new FlashMsg()
                    {
                        Text = state.Errors[0].ErrorMessage,
                        Type = emMessageType.Error
                    });
                }
            }
        }

        // c.Resolve<IDbConnectionFactory>()
        public virtual string GetDefaultMasterName()
        {
            return "_Layout";
        }

        #region actions
        /// <summary>
        /// Returns a status 404 to the client and the error 404 view.
        /// </summary>
        /// <param name="emptyBody">true: the response ends</param>
        public static ActionResult NotFoundResult(AppControllerBase controller, bool emptyBody)
        {
            controller.ControllerContext.HttpContext.Response.StatusCode = 404;
            if (emptyBody)
            {
                controller.ControllerContext.HttpContext.Response.End();
            }

            ViewResult viewResult = new ViewResult();
            viewResult.ViewName = "Errors/404";
            viewResult.MasterName = controller.GetDefaultMasterName();
            return viewResult;
        }

        /// <summary>
        /// Returns a status 404 to the client and the error 404 view.
        /// </summary>
        /// <param name="controller"></param>
        /// <returns></returns>
        public static ActionResult NotFoundResult(AppControllerBase controller)
        {
            return NotFoundResult(controller, false);
        }


        /// <summary>
        /// Returns a http status 403 to the client and the error 403 view.
        /// </summary>
        /// <param name="controller"></param>
        /// <returns></returns>
        public static ActionResult ForbiddenResult(AppControllerBase controller)
        {
            return ForbiddenResult(controller, false);
        }

        /// <summary>
        /// Returns a http status 403 to the client and the error 403 view.
        /// </summary>
        /// <param name="controller">current controller</param>
        /// <param name="emptyBody">true: the http response end without body</param>
        /// <returns></returns>
        public static ActionResult ForbiddenResult(AppControllerBase controller, bool emptyBody)
        {
            controller.ControllerContext.HttpContext.Response.StatusCode = 403;
            if (emptyBody)
            {
                controller.ControllerContext.HttpContext.Response.End();
                return new EmptyResult();
            }

            ViewResult viewResult = new ViewResult();
            viewResult.ViewName = "Errors/403";
            viewResult.MasterName = controller.GetDefaultMasterName();
            return viewResult;
        }
        #endregion 

        
    }
}

