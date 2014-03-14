using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using ServiceStack.ServiceInterface.Auth;

namespace App.Services
{
    public class CustomUserSession : AuthUserSession
    {
        public string CustomId { get; set; }
    }
}
