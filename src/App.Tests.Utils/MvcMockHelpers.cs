using System;
using System.Collections.Specialized;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;
using NSubstitute;

namespace App.Tests.Utils
{
    /// <summary>
    /// This class of MVC Mock helpers is originally based on Scott Hanselman's 2008 post
    /// use NSubstitute instead of moq
    /// </summary>
    public static class MvcMockHelpers
    {
        #region Mock HttpContext factories

        public static HttpContextBase MockHttpContext()
        {
            var context = Substitute.For<HttpContextBase>();
            var request = Substitute.For<HttpRequestBase>();
            var response = Substitute.For<HttpResponseBase>();
            var session = Substitute.For<HttpSessionStateBase>();
            var server = Substitute.For<HttpServerUtilityBase>();

            request.AppRelativeCurrentExecutionFilePath.Returns("/");
            request.ApplicationPath.Returns("/");

          //  response.ApplyAppPathModifier(It.IsAny<string>()).ReturnsForAnyArgs();//.Returns(string);
            response.StatusCode = (int) System.Net.HttpStatusCode.OK;

            context.Request.Returns(request);
            context.Response.Returns(response);

            context.Request.Returns(request);
            context.Response.Returns(response);
            context.Session.Returns(session);
            context.Server.Returns(server);

            return context;
        }

        public static HttpContextBase MockHttpContext(string url)
        {
            var context = MockHttpContext();
            context.Request.SetupRequestUrl(url);
            return context;
        }

        #endregion

        #region Extension methods

        public static void SetMockControllerContext(this Controller controller,
            HttpContextBase httpContext = null,
            RouteData routeData = null,
            RouteCollection routes = null)
        {
            //If values not passed then initialise
            routeData = routeData ?? new RouteData();
            routes = routes ?? RouteTable.Routes;
            httpContext = httpContext ?? MockHttpContext();

            var requestContext = new RequestContext(httpContext, routeData);
            var context = new ControllerContext(requestContext, controller);

            //Modify controller
            controller.Url = new UrlHelper(requestContext, routes);
            controller.ControllerContext = context;
        }

        public static void SetHttpMethodResult(this HttpRequestBase request, string httpMethod)
        {
            request.HttpMethod.Returns(httpMethod);
        }

        public static void SetupRequestUrl(this HttpRequestBase request, string url)
        {
            if (url == null)
                throw new ArgumentNullException("url");

            if (!url.StartsWith("~/"))
                throw new ArgumentException("Sorry, we expect a virtual url starting with \"~/\".");

            //var mock = Mock.Get(request);
            request.QueryString.Returns(GetQueryStringParameters(url));
            request.AppRelativeCurrentExecutionFilePath.Returns(GetUrlFileName(url));
            request.PathInfo.Returns(string.Empty);
        //    mock.Setup(req => req.QueryString).Returns(GetQueryStringParameters(url));
            //mock.Setup(req => req.AppRelativeCurrentExecutionFilePath).Returns(GetUrlFileName(url));
           // mock.Setup(req => req.PathInfo).Returns(string.Empty);
        }


        /// <summary>
        /// Facilitates unit testing of anonymouse types - taken from here:
        /// http://stackoverflow.com/a/5012105/761388
        /// </summary>
        public static object GetReflectedProperty(this object obj, string propertyName)
        {
            obj.ThrowIfNull("obj");
            propertyName.ThrowIfNull("propertyName");

            var property = obj.GetType().GetProperty(propertyName);

            if (property == null)
                return null;

            return property.GetValue(obj, null);
        }

        public static T ThrowIfNull<T>(this T value, string variableName) where T : class
        {
            if (value == null)
                throw new NullReferenceException(
                    string.Format("Value is Null: {0}", variableName));

            return value;
        }

        #endregion

        #region Private

        static string GetUrlFileName(string url)
        {
            return (url.Contains("?"))
                ? url.Substring(0, url.IndexOf("?"))
                : url;
        }

        static NameValueCollection GetQueryStringParameters(string url)
        {
            if (url.Contains("?"))
            {
                var parameters = new NameValueCollection();

                var parts = url.Split("?".ToCharArray());
                var keys = parts[1].Split("&".ToCharArray());

                foreach (var key in keys)
                {
                    var part = key.Split("=".ToCharArray());
                    parameters.Add(part[0], part[1]);
                }

                return parameters;
            }

            return null;
        }

        #endregion
    }
}