using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using App.Utils;
using App.WebUI.LightInject;
using ServiceStack.CacheAccess;
using ServiceStack.CacheAccess.Providers;
using ServiceStack.Configuration;
using ServiceStack.OrmLite;
using ServiceStack.MiniProfiler.Data;
using ServiceStack.MiniProfiler;
using App.Services;
using App.ServicesInterface;
using App.WebUI.Mailers;

namespace App.WebUI.App_Start
{
    public static class Dependency
    {
        internal static void Inject(ServiceContainer container, IResourceManager appSettings)
        {
            container.Register(c=>new AppConfig(appSettings));
            container.Register<ICacheClient>(c => new MemoryCacheClient());
            container.Register<IUsersManageService>(s => new UsersManageService());
            container.Register<ILoginService>(s => new LoginService());
            container.Register<IUserMailer>(u => new UserMailer());

            //db connection
            var connStr = container.GetInstance<AppConfig>().SqlserverConnectionString;
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