using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data;
using ServiceStack.Logging;

namespace App.Services
{
    public abstract class AppServiceBase : ServiceStack.ServiceInterface.Service
    {
        public static readonly ILog Logger = LogManager.GetLogger(typeof(AppServiceBase)); 
    }
}
