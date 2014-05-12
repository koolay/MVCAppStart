using System;
using System.Web;

namespace App.Utils
{
    public static class RequestHelper
    {
        public static string ClientIPAddress(this HttpRequest request)
        {
            var ip = request.Headers["Real-IP"];
            if (string.IsNullOrEmpty(ip))
            {
                ip = HttpContext.Current.Request.UserHostAddress;
            }
            return ip;
        }
    }
}
