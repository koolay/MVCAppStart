using Mvc.Mailer;
using System.Web.Mvc;
using App.Models.Email;

namespace App.WebUI.Mailers
{ 
    public class UserMailer : MailerBase, IUserMailer 	
	{
		public UserMailer()
		{
			MasterName="_Layout";
		}
 
		public virtual void  PasswordReset(PasswordResetMailModel model)
		{         
            ViewData = new ViewDataDictionary();
            ViewData.Model = model;
			MvcMailMessage mail = Populate(x =>
			{
                x.Subject = model.Title;
				x.ViewName = "PasswordResetMail";
				x.To.Add(model.Receiver);
			});
            mail.Send();//.SendAsync();
		}
 	}
}