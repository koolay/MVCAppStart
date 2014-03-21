using System.Data;
using System.Collections.Generic;
using ServiceStack.Configuration;
using ServiceStack.ServiceInterface;
using ServiceStack.ServiceInterface.Auth;
using ServiceStack.WebHost.Endpoints;
using ServiceStack.OrmLite;

using App.Entities;

namespace App.ServicesInterface
{
    public class CustomCredentialsAuthProvider : CredentialsAuthProvider
    {
        public CustomCredentialsAuthProvider(IResourceManager appSettings)
        {

        }

        public virtual IDbConnection Db
        {
            get
            {
                var container = ((AppHostBase)EndpointHost.AppHost).Container;
                return container.TryResolve<IDbConnectionFactory>().OpenDbConnection();
            }
        }

        private IDbConnection GetDB(IServiceBase authService)
        {
            return authService.TryResolve<IDbConnectionFactory>().OpenDbConnection();
        }

        public override bool TryAuthenticate(IServiceBase authService, string userName, string password)
        {
            if (string.IsNullOrEmpty(userName) || string.IsNullOrEmpty(password))
                return false;
            using (var db = GetDB(authService))
            {
                var user = db.FirstOrDefault<Account>(c => c.UserName == userName && c.Password == password);
                if (user!=null)
                {
                    var session = (CustomUserSession)authService.GetSession(false);
                    session.UserName = user.UserName;
                    session.DisplayName = user.DisplayName;
                    session.IsAuthenticated = true;                    
                                      
                  //  session.Roles = new List<string>();
                //    if (session.DisplayName == "admin") session.Roles.Add(RoleNames.Admin);
                 //   session.Roles.Add("User");

                    return true;
                }
                return false;
            }
 
        }

        public override void OnAuthenticated(IServiceBase authService, IAuthSession session, IOAuthTokens tokens, Dictionary<string, string> authInfo)
        { 
            //Important: You need to save the session!
            session.IsAuthenticated = true;
            session.UserName = session.UserAuthName;
            session.DisplayName = session.DisplayName;
            authService.SaveSession(session, SessionExpiry); 
            
        }
    }

}