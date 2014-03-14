using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using ServiceStack;
using ServiceStack.WebHost.Endpoints;
using ServiceStack.ServiceInterface.Auth;
using App.ServicesInterface;
using App.Entities;
using ServiceStack.Common.Web;
using System.Web.Security;

namespace App.Services
{
    public class LoginService : AppServiceBase, ILoginService
    {
        public EmLoginValidStatus Login(string username, string password, bool remember)
        {
            var authService = AppHostBase.Resolve<AuthService>();
            authService.RequestContext = System.Web.HttpContext.Current.ToRequestContext();
            try
            {
                var authResponse = authService.Authenticate(new Auth
                {
                    UserName = username,
                    Password = password,
                    RememberMe = remember
                });
                if (authResponse == null)
                    return EmLoginValidStatus.PassportError;
                FormsAuthentication.SetAuthCookie(username, remember);
            }
            catch (HttpError e)
            {
                if (e.StatusCode == System.Net.HttpStatusCode.Unauthorized)
                {
                    return EmLoginValidStatus.PassportError;
                }
                else
                {
                    Logger.Error("login failed!", e);
                    return EmLoginValidStatus.SystemError;
                }
            }
            return EmLoginValidStatus.Success;
        }

        public void Logout()
        {
            var apiAuthService = AppHostBase.Resolve<AuthService>();
            apiAuthService.RequestContext = System.Web.HttpContext.Current.ToRequestContext();
            apiAuthService.Post(new Auth() { provider = "logout" });
            FormsAuthentication.SignOut();
        }
    }
}
