using ServiceStack.Logging;
using App.Utils;
using ServiceStack.ServiceInterface;

namespace App.Services
{
    public abstract class AppServiceBase : Service
    {
        public static readonly ILog Logger = LogManager.GetLogger(typeof(AppServiceBase));

        public AppConfig AppConfig
        {
            get
            {
                return this.TryResolve<AppConfig>();
            }
        }

    }
}
