using App.Entities;
using App.ServicesInterface.Common;

namespace App.ServicesInterface
{
    public interface ILoginService
    {
        EmLoginValidStatus Login(string username, string password, bool remember);
        bool IsLogined();
        void Logout();
        CustomUserSession GetLoginedSession();
    }
}
