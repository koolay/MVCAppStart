using Mvc.Mailer;
using App.Models.Email;

namespace App.WebUI.Mailers
{
    public interface IUserMailer
    {
        void PasswordReset(PasswordResetMailModel model);
    }
}