using System;
using System.Web.Mvc;

using ServiceStack.ServiceInterface;
using ServiceStack.Common;
using App.Extensions;
using App.ServicesInterface;
using App.Models.Passport;
using App.Entities;
using App.WebUI.Mailers;
using App.Models.Email;

namespace App.WebUI.Controllers
{
    public class PassportController : AppControllerBase
    {
        public IUsersManageService UserService { get; set; }
        
        public IUserMailer UserMailer { get; set; }

        [HttpPost]
        public ActionResult Login(LoginModel model, string next)
        {
            if (!ModelState.IsValid)
            {
                this.FlashModelStatusError();
                return View(model);
            }

            const string TEXT_PASSPORT_ERROR = "Incorrect username or password.";
            const string TEXT_PASSPORT_SUCCESS = "Login Success.";
            EmLoginValidStatus loginStatus = EmLoginValidStatus.Success;

            loginStatus = LoginService.Login(model.UserName, model.Password, model.Remember);

            if (loginStatus == EmLoginValidStatus.Success)
            {
                this.Flash(new FlashMsg()
                {
                    Text = TEXT_PASSPORT_SUCCESS,
                    Type = emMessageType.Success
                });
                return this.RedirectNext(next);
            }
            else
            {
                this.Flash(new FlashMsg()
                {
                    Text = TEXT_PASSPORT_ERROR,
                    Type = loginStatus == EmLoginValidStatus.Success ? emMessageType.Success : emMessageType.Error
                });
                return View(model);
            }

        }

        [HttpGet]
        public ActionResult Login()
        {
            return View();
        }

        [HttpGet]
        public ActionResult Register()
        {
            return View();
        }

        [HttpPost]
        public ActionResult Register(RegisterModel model, string next)
        {
            if (!ModelState.IsValid)
            {
                this.FlashModelStatusError();
                return View();
            }

            var status = this.UserService.Register(new Account()
            {
                Password = model.Password,
                UserName = model.UserName,
                DisplayName = model.DisplayName
            });

            switch (status)
            {
                case EmRegisterStatus.AccountExist:
                    {
                        this.Flash(new FlashMsg()
                        {
                            Text = " account existed",
                            Type = emMessageType.Error
                        });
                        break;
                    }
                case EmRegisterStatus.SysError:
                    {
                        this.Flash(new FlashMsg()
                        {
                            Text = " system error",
                            Type = emMessageType.Error
                        });
                        break;
                    }
                case EmRegisterStatus.Success:
                    {
                        this.Flash(new FlashMsg()
                        {
                            Text = "success, please <a href='" + Url.Action("Login") + "' target='self'>login</a>",
                            Type = emMessageType.Success
                        });
                        break;
                    }
            }
            if (status == EmRegisterStatus.Success)
                return this.RedirectNext(next);
            else
                return View();

        }

        [HttpGet]
        public ActionResult Logout(string next)
        {
            this.LoginService.Logout();
            string returnUrl = next ?? "/";
            return Redirect(Url.Content(returnUrl));
        }

        [HttpGet, Authenticate]
        public ActionResult UserManage()
        {
            var model = new UserManageModel {UserList = this.UserService.GetAllUsers()};
            return View(model);
        }

        [HttpGet]
        public ActionResult Delete(string id)
        {
            this.UserService.Delete(id);
            return RedirectToAction("UserManage", "Passport");
        }

        [HttpGet]
        public ActionResult ResetPassword()
        {            
            return View();
        }
        
        [HttpPost]
        public ActionResult ResetPassword(string email)
        {
            if (string.IsNullOrWhiteSpace(email))
            {
                this.Flash(new FlashMsg()
                {
                    Text = "unvalid email",
                    Type = emMessageType.Error
                    
                });
                return View();
            }
            if (!this.UserService.IsExistsUserName(email))
            {
                this.Flash(new FlashMsg()
                    {
                         Text = "email is not exits",
                         Type= emMessageType.Error
                    });
                return View();
            }
            
            string enToken = CryptUtils.Encrypt(string.Format("{0}${1}", email, DateTime.Now.ToFileTime()));
            string deToken = CryptUtils.Decrypt(enToken);
            string[] tokenSplits = deToken.Split(new char[] { '$' });
            this.UserMailer.PasswordReset(new PasswordResetMailModel()
            {
                ActiveUrl = Url.Action("ChangePassword","Passport", new  {token=enToken}),
                Receiver = email,
                Title = "Password Reset"
            });
            
            this.Flash(new FlashMsg()
            {
                Text = "we have send an email  for you",
                Type = emMessageType.Success
            });          
           
            return RedirectToAction("ResetPassword"); 
        }

        [HttpGet]
        public ActionResult ChangePassword(string token)
        {
            try
            {
                string deToken = CryptUtils.Decrypt(token);
                string[] tokenSplits = deToken.Split(new char[] { '$' });
                string email = tokenSplits[0];
                string when = tokenSplits[1];
                var whenTime = DateTime.FromFileTime(long.Parse(when));
                if (DateTime.Now.Subtract(whenTime).TotalMinutes > 24 * 60)
                {
                    this.Flash(new FlashMsg()
                    {
                        Text = "The token is timeout",
                        Type = emMessageType.Error
                    });
                    return View();
                }
            }
            catch (Exception ex)
            {
                this.Flash(new FlashMsg()
                {
                     Text = "unvalid token",
                     Type= emMessageType.Error
                });
                return View();
            }            
            return View();
        }

        [HttpPost]
        public ActionResult ChangePassword(ChangePasswordModel model)
        {
            if (!ModelState.IsValid)
            {
                this.FlashModelStatusError();
                return View();
            }
            else
            {
                this.UserService.ChangeUserPassword(model.UserName, model.NewPassword);
                this.Flash(new FlashMsg()
                {
                    Text = "success. Your password have a new password.",
                    Type = emMessageType.Success
                });
                return RedirectToAction("Login");
            }
        }
    }
}
