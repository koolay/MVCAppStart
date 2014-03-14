using System.Web.Mvc;
using ServiceStack.Logging;

namespace App.Filters
{
    public class HandleErrorLogAttribute : HandleErrorAttribute
    {

        public readonly ILog Logger = LogManager.GetLogger(typeof(HandleErrorLogAttribute)); 
        public override void OnException(ExceptionContext filterContext)
        {
            
            if ((!filterContext.ExceptionHandled) && filterContext.HttpContext.IsCustomErrorEnabled)
            {
                Logger.Error(filterContext.Exception);
            }
            base.OnException(filterContext);
        }
    }
}