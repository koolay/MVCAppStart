
using System.Web;
using Funq;
using ServiceStack;
using ServiceStack.CacheAccess;
using ServiceStack.CacheAccess.Providers;
using ServiceStack.Configuration;
using ServiceStack.OrmLite;
using ServiceStack.MiniProfiler.Data;
using ServiceStack.MiniProfiler;
using ServiceStack.ServiceHost;

using App.Utils;
using App.Services;
using App.ServicesInterface;
using App.WebUI.Mailers;

namespace App.WebUI.App_Start
{
    public static class Dependency
    {
        internal static void Inject(Container container, IResourceManager appSettings)
        {
            container.Register(c => HttpContext.Current.ToRequestContext().Get<IHttpRequest>());
            container.Register(new AppConfig(appSettings));
            container.Register<ICacheClient>(new MemoryCacheClient());

            container.Register<IUsersManageService>(new UsersManageService());
            container.Register<ILoginService>(new LoginService());
            container.Register<IUserMailer>(new UserMailer());

            //db connection
            var connStr = container.Resolve<AppConfig>().SqlserverConnectionString;
            container.Register<IDbConnectionFactory>(
                fac =>
                    new OrmLiteConnectionFactory(connStr,
                        ServiceStack.OrmLite.PostgreSQL.PostgreSQLDialectProvider.Instance)
                    {
                        ConnectionFilter = conn => new ProfiledDbConnection(conn, Profiler.Current, true)
                    });

        }
    }
}