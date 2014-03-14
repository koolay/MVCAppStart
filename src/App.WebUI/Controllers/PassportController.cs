using System;
using System.Web.Mvc;

using ServiceStack;
using ServiceStack.WebHost.Endpoints;
using ServiceStack.ServiceInterface;
using ServiceStack.ServiceInterface.Auth;

using App.Extensions;
using App.ServicesInterface;
using App.Models.Passport;
using App.Entities;


namespace App.WebUI.Controllers
{
    public class PassportController : AppControllerBase
    {
        public IUsersManageService UserService { get; set; }
        public ILoginService LoginService { get; set; }

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
        public ActionResult Logout()
        {
            this.LoginService.Logout();
            string returnUrl = Request.QueryString["next"] ?? "/";
            return Redirect(Url.Content(returnUrl));
        }

        [HttpGet, Authenticate]
        public ActionResult UserManage()
        {
            var model = new UserManageModel();
            model.UserList = this.UserService.GetAllUsers();
            return View(model);
        }

         [HttpGet]
        public ActionResult Delete(string id)
        {
            this.UserService.Delete(id);
            return RedirectToAction("UserManage", "Passport");
        }

    }
}
