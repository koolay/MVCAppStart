﻿using System;
using System.Text;
using System.Web;

namespace App.Utils
{
    public static class URLHelper
    {
        ///<summary>
        /// Base 64 Encoding with URL and Filename Safe Alphabet using UTF-8 character set.
        ///</summary>
        ///<param name="str">The origianl string</param>
        ///<returns>The Base64 encoded string</returns>
        public static string Base64ForUrlEncode(string str)
        {
            if (string.IsNullOrEmpty(str))
                return string.Empty;

            byte[] encbuff = Encoding.UTF8.GetBytes(str);
            return HttpServerUtility.UrlTokenEncode(encbuff);
        }

        ///<summary>
        /// Decode Base64 encoded string with URL and Filename Safe Alphabet using UTF-8.
        ///</summary>
        ///<param name="str">Base64 code</param>
        ///<returns>The decoded string.</returns>
        public static string Base64ForUrlDecode(string str)
        {
            if (string.IsNullOrEmpty(str))
                return string.Empty;

            var decbuff = HttpServerUtility.UrlTokenDecode(str);
            return Encoding.UTF8.GetString(decbuff);
        }
        
    }
}
