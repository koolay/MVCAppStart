using ServiceStack.CacheAccess;
using ServiceStack.Logging;
using App.Utils;

namespace App.Services
{
    public abstract class AppServiceBase : ServiceStack.ServiceInterface.Service
    {
        public static readonly ILog Logger = LogManager.GetLogger(typeof(AppServiceBase));
        public ICacheClient AppCache { get; set; }
        public AppConfig AppConfig { get; set; }
    }
}
