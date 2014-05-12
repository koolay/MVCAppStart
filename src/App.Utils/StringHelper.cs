using System.Text;
using System.Web;

namespace App.Utils
{
    public static class StringHelper
    {
        public static string SafeInputEncode(string inputText)
        {
            return HttpUtility.HtmlEncode(inputText);
        }

        public static string SafeInputDecode(string enInputText)
        {
            return HttpUtility.HtmlDecode(enInputText);
        }
    }
}
