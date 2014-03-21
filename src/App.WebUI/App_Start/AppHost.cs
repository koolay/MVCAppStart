using System.Web.Mvc;
using System.Data;
using App.Utils;
using ServiceStack.Configuration;
using ServiceStack.Mvc;
using ServiceStack.OrmLite;
using ServiceStack.ServiceInterface;
using ServiceStack.ServiceInterface.Auth;
using ServiceStack.WebHost.Endpoints;
using ServiceStack.Logging;
using ServiceStack.Logging.NLogger;
using ServiceStack.MiniProfiler.Data;
using ServiceStack.MiniProfiler;
using ServiceStack.OrmLite.SqlServer;

using App.WebUI.Controllers;
using App.Entities;
using App.WebUI.LightInject;
using App.Services;

[assembly: WebActivator.PreApplicationStartMethod(typeof(App.WebUI.App_Start.AppHost), "Start")]

namespace App.WebUI.App_Start
{

	public class AppHost: AppHostBase
	{
	    private static AppConfig _appConfig;

		public AppHost() : base("app host", typeof(AppControllerBase).Assembly) { }

		public override void Configure(Funq.Container container)
		{
            var appSettings = new AppSettings();
            
            ServiceStack.Text.JsConfig.EmitCamelCaseNames = true;         
       
            LogManager.LogFactory = new NLogFactory();           
            var lightContainer = new  ServiceContainer();
            Dependency.Inject(lightContainer, appSettings);
            SetConfig(new EndpointHostConfig());
            this.ConfigureAuth(appSettings);
            this.InitDatabase(lightContainer);
           
            container.Adapter = new LightInjectContainerAdapter(lightContainer);
            ControllerBuilder.Current.SetControllerFactory(new FunqControllerFactory(container));
		}

        private void InitDatabase(ServiceContainer container)
        {
            var dbFactory = container.GetInstance<IDbConnectionFactory>();
            using (IDbConnection db = dbFactory.OpenDbConnection())
            {
                db.CreateTableIfNotExists<Account>();
            }
        }

        private void ConfigureAuth(IResourceManager appSettings)
        {
           
            Plugins.Add(new AuthFeature(() => new CustomUserSession(),
                new IAuthProvider[] { 
                    new CustomCredentialsAuthProvider(appSettings), 
                }));
            Plugins.Add(new RegistrationFeature());

        }
		public static void Start()
		{
			new AppHost().Init();
		}
	}
}