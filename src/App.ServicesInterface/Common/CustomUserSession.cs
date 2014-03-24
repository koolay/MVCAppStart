using System.Runtime.Serialization;
using ServiceStack.ServiceInterface.Auth;

namespace App.ServicesInterface.Common
{
    [DataContract]
    public class CustomUserSession : AuthUserSession
    {
        [DataMember]
        public string CustomId { get; set; }
    }
}
