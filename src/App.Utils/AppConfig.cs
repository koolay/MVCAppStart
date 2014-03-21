using System;
using ServiceStack.Configuration;

namespace App.Utils
{
    public class AppConfig
    {
        public AppConfig(IResourceManager appSettings)
        {
            this.SqlserverConnectionString = appSettings.Get("SQL_CONNECTION_STRING", ConfigUtils.GetConnectionString("appSqlConnection"));
        }

        public string SqlserverConnectionString { get; private set; }
       
    }

    public enum Env
    {
        Local,
        Dev,
        Test,
        Prod,
    }

}