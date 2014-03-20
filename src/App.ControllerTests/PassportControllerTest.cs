using System;
using System.Collections.Generic;
using NSubstitute;
using TestStack.FluentMVCTesting;
using Xunit;

using App.Entities;
using App.Models.Passport;
using App.ServicesInterface;
using App.Tests.Utils;
using App.WebUI.Controllers;

namespace App.Tests.Controllers
{
    public class PassportControllerTest
    {
        private readonly ILoginService _loginService;
        private readonly PassportController _controller;
        private readonly IUsersManageService _usersManageService;

        public PassportControllerTest()
        {
            this._loginService = Substitute.For<ILoginService>();
            this._usersManageService = Substitute.For<IUsersManageService>();
            this._controller = new PassportController
            {
                LoginService = this._loginService,
                UserService = _usersManageService
            };
            this._controller.SetMockControllerContext();

        }

        [Fact]
        public void Login()
        {
            const string username = "ccc";
            const string password = "123456";

            this._loginService.Login(username, password, true).Returns(EmLoginValidStatus.Success);
            //get
            this._controller.WithCallTo(controller => controller.Login()).ShouldRenderView("Login");

            //test login failed
            this._controller.WithCallTo(c => c.Login(new LoginModel()
            {
                UserName = "loginFailure",
                Password = password,
                Remember = true
            }, "/")).ShouldRenderView("Login");

            //test login success
            this._controller.WithCallTo(c => c.Login(new LoginModel()
            {
                Password = password,
                UserName = username,
                Remember = true
            }, "/index")).ShouldRedirectTo("/index");

        }

        [Fact]
        public void Register()
        {
            var modelSuccess = new RegisterModel()
            {
                DisplayName = "displayname",
                ConfirmPassword = "123456",
                Password = "123456",
                UserName = "username"
            };
            var modelExists = new RegisterModel()
            {
                DisplayName = "displayname_exists",
                ConfirmPassword = "123456",
                Password = "123456",
                UserName = "username_exits"
            };

            var modelUserNameError = new RegisterModel()
            {
                DisplayName = "123",
                UserName = "123",
                Password = "123",
                ConfirmPassword = "123"
            };

            var accountSuccess = new Account() { DisplayName = modelSuccess.DisplayName, Password = modelSuccess.Password, UserName = modelSuccess.UserName };
            var accountExists = new Account() { DisplayName = modelExists.DisplayName, Password = modelExists.Password, UserName = modelExists.UserName };
            
            this._usersManageService.Register(
                Arg.Is<Account>(
                    a => a.DisplayName == accountSuccess.DisplayName && a.Password == accountSuccess.Password
                         && a.UserName == accountSuccess.UserName && a.Id == accountSuccess.Id))
                .Returns(EmRegisterStatus.Success);

            this._usersManageService.Register(Arg.Is<Account>(
                    a => a.DisplayName == accountExists.DisplayName && a.Password == accountExists.Password
                         && a.UserName == accountExists.UserName && a.Id == accountExists.Id)).Returns(EmRegisterStatus.AccountExist);
            
            this._controller.WithCallTo(c => c.Register(modelSuccess, "/")).ShouldRedirectTo("/");
            this._controller.WithCallTo(c => c.Register(modelExists, "/")).ShouldRenderView("Register");
            this._controller.WithModelErrors().WithCallTo(c => c.Register(modelUserNameError, "/"))
                .ShouldRenderView("Register");

        }

        [Fact]
        public void Logout()
        {
            const string returnUrl = "/index";
            this._controller.WithCallTo(c => c.Logout(returnUrl)).ShouldRedirectTo(returnUrl);
            const string noReturnUrl = null;
            this._controller.WithCallTo(c => c.Logout(noReturnUrl)).ShouldRedirectTo("/");

        }

        [Fact]
        public void UserManage()
        {
            this._controller.WithCallTo(c => c.UserManage())
                .ShouldRenderView("UserManage")
                .WithModel<UserManageModel>();

        }
    }
}