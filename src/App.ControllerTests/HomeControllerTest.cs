using System;

using NSubstitute;
using TestStack.FluentMVCTesting;
using Xunit;

using App.Entities;
using App.Models.Passport;
using App.ServicesInterface;
using App.Tests.Utils;
using App.WebUI.Controllers;
using App.Models.Home;

namespace App.Tests.Controllers
{
    public class HomeControllerTest
    {
        private readonly HomeController _controller;

        public HomeControllerTest()
        {
            this._controller = new HomeController();
        }

        [Fact]
        public void Index()
        {
            this._controller.WithCallTo(c => c.Index())
                .ShouldRenderView("Index")
                .WithModel<IndexModel>();
        }

        
    }
}
