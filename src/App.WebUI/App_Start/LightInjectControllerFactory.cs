using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;
using ServiceStack.ServiceHost;
using System.Reflection;
using App.WebUI.LightInject;
using ServiceStack.Mvc;

namespace App.WebUI.App_Start
{
    public class LightInjectControllerFactory : DefaultControllerFactory
    {
        private ServiceContainer _container;

        /// <summary>
        /// Initializes a new instance of the <see cref="FunqControllerFactory" /> class.
        /// </summary>
        /// <param name="container">The container.</param>
        /// <param name="assemblies">The assemblies to reflect for IController discovery.</param>
        internal LightInjectControllerFactory(ServiceContainer container, params Assembly[] assemblies)
		{
            this._container = container;

            // aggregate the local and external assemblies for processing (unless ignored)
            IEnumerable<Assembly> targetAssemblies = assemblies.Concat(new[] { Assembly.GetCallingAssembly() });

            foreach (var assembly in targetAssemblies)
            {
                // Also register all the controller types as transient
                var controllerTypes =
                    (from type in assembly.GetTypes()
                     where typeof(IController).IsAssignableFrom(type)
                     select type).ToList();
                container.RegisterControllers(assemblies);
               // container.RegisterAutoWiredTypes(controllerTypes);
            }
		}

		protected override IController GetControllerInstance(RequestContext requestContext, Type controllerType)
		{
			try
			{
				if (controllerType == null)
					return base.GetControllerInstance(requestContext, null);

				var controller = this._container.GetInstance(controllerType) as IController;

				return controller ?? base.GetControllerInstance(requestContext, controllerType);
			}
			catch (HttpException ex)
			{
				if (ex.GetHttpCode() == 404)
				{
					try
					{
						if (ServiceStackController.CatchAllController != null)
						{
							return ServiceStackController.CatchAllController(requestContext);
						}
					}
					catch { } //ignore not found CatchAllController
				}
				throw;
			}
		}
    }
}