using System.Web.Mvc;
using System.Data;
using App.ServicesInterface;
using Funq;
using ServiceStack.Configuration;
using ServiceStack.Mvc;
using ServiceStack.OrmLite;
using ServiceStack.ServiceInterface;
using ServiceStack.ServiceInterface.Auth;
using ServiceStack.WebHost.Endpoints;
using ServiceStack.Logging;
using ServiceStack.Logging.NLogger;

using App.WebUI.Controllers;
using App.Entities;

[assembly: WebActivator.PreApplicationStartMethod(typeof(App.WebUI.App_Start.AppHost), "Start")]
namespace App.WebUI.App_Start
{

	public class AppHost: AppHostBase
	{
		public AppHost() : base("app host", typeof(AppControllerBase).Assembly) { }

		public override void Configure(Container container)
		{
            var appSettings = new AppSettings();
            
            ServiceStack.Text.JsConfig.EmitCamelCaseNames = true;         
       
            LogManager.LogFactory = new NLogFactory();

            Dependency.Inject(container, appSettings);
            SetConfig(new EndpointHostConfig());
            this.ConfigureAuth(appSettings);
            this.InitDatabase(container);
            ControllerBuilder.Current.SetControllerFactory(new FunqControllerFactory(container));
           
		}

        private void InitDatabase(Container container)
        {
            var dbFactory = container.Resolve<IDbConnectionFactory>();
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