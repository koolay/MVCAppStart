using System;
using ServiceStack.Configuration;
using App.WebUI.LightInject;

namespace App.WebUI.App_Start
{
    public class LightInjectContainerAdapter : IContainerAdapter
    {
        private readonly IServiceContainer _container;

        internal LightInjectContainerAdapter(IServiceContainer container)
        {
            _container = container;
        }

        public T Resolve<T>()
        {
            return _container.GetInstance<T>();
        }

        public T TryResolve<T>()
        {
            return _container.TryGetInstance<T>();
        }
    }
}