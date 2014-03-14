using System;
using System.Data;
using ServiceStack.WebHost.Endpoints;
using ServiceStack.OrmLite;

namespace App.Services
{
    public class DBHelper
    {
        private static  IDbConnection db;
        public static  IDbConnection DB
        {
            get
            {
                var container = ((AppHostBase)EndpointHost.AppHost).Container;
                return db ?? (db = container.TryResolve<IDbConnectionFactory>().OpenDbConnection());
            }
        }
    }
}
