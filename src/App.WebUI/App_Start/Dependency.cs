using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using App.WebUI.LightInject;
using App.WebUI.LightInject.Mvc;
using ServiceStack.OrmLite;
using ServiceStack.MiniProfiler.Data;
using ServiceStack.MiniProfiler;
using ServiceStack.Configuration;
using App.WebUI.Controllers;
using App.Services;
using App.ServicesInterface;

namespace App.WebUI.App_Start
{
    public static class Dependency
    {
        internal static void Inject(ServiceContainer container, AppSettingsBase appSettings)
        {
            //db connection
            var connStr = appSettings.Get("SQLSERVER_CONNECTION_STRING", ConfigUtils.GetConnectionString("appSqlConnection"));
            container.Register<IDbConnectionFactory>(fac => new OrmLiteConnectionFactory(connStr, ServiceStack.OrmLite.PostgreSQL.PostgreSQLDialectProvider.Instance)
            {
                ConnectionFilter = conn => new ProfiledDbConnection(conn, Profiler.Current, true)
            });

            container.Register<IUsersManageService>(s => new UsersManageService());
            container.Register<ILoginService>(s => new LoginService());
        }
    }
}