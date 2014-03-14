using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web.Mvc;
using System.Web;


namespace App.Extensions
{
    public static class FlashMessager
    {
        private const string C_FLASH_MESSAGE_KEY = "flash_key";
        public static void Flash(this Controller controller, FlashMsg msg)
        {
            if (msg == null)
                return;
            var msgListObj = controller.Session[C_FLASH_MESSAGE_KEY];
            var msgList = msgListObj != null ? (List<FlashMsg>)msgListObj : new List<FlashMsg>();
            msgList.Add(msg);
            controller.Session[C_FLASH_MESSAGE_KEY] = msgList;
        }

        public static IHtmlString Messages(this HtmlHelper html)
        {
            var session = html.ViewContext.Controller.ControllerContext.HttpContext.Session;
            var msgsObj = session[C_FLASH_MESSAGE_KEY];
            List<FlashMsg> msgs = new List<FlashMsg>();

            if (msgsObj != null)
                msgs = (List<FlashMsg>)msgsObj;

            if (msgs != null && msgs.Count > 0)
            {
                StringBuilder contentHtml = new StringBuilder("");
                string styleClass = "alert-info";
                foreach (var msg in msgs)
                {                   
                    switch (msg.Type)
                    {
                        case emMessageType.Error:
                            {
                                styleClass = "alert-danger";
                                break;
                            }
                        case emMessageType.Info:
                            {
                                styleClass = "alert-info";
                                break;
                            }
                        case emMessageType.Warning:
                            {
                                styleClass = "alert-dismissable";
                                break;
                            }
                        case emMessageType.Success:
                            {
                                styleClass = "alert-success";
                                break;
                            }
                    }
                    contentHtml.Append("<p class=\"tip-line\">");
                    contentHtml.Append(msg.Text);
                    contentHtml.Append("</p>");               
                }
                string htmlReturn = string.Empty;

                if (contentHtml.Length > 0)
                {
                    htmlReturn = "<div class=\"alert " + styleClass + "\"><button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-hidden=\"true\">×</button>";
                    htmlReturn += contentHtml.ToString();
                    htmlReturn += "</div>";                   
                }               
                session.Remove(C_FLASH_MESSAGE_KEY);
                return html.Raw(htmlReturn);
            }
            else
            {
                return MvcHtmlString.Empty;
            }

        }
    }


    [Serializable]
    public class FlashMsg
    {
        private emMessageType _type = emMessageType.Info;

        public emMessageType Type
        {
            get { return _type; }
            set { _type = value; }
        }
        public string Text { get; set; }
    }

    public enum emMessageType
    {
        Error = 0,
        Info = 1,
        Warning = 2,
        Success = 3
    }
  
}