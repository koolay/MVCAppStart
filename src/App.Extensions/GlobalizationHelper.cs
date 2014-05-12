using System;
using System.Collections;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Resources;
using System.Threading;
using System.Web;
using System.Web.Mvc;
using App.Utils;

namespace App.Extensions
{
    public static class GlobalizationHelper
    {
        public static AppConfig AppConfig { get; set; }
        private const string C_ResourceFileExtension = ".resx";
        private const string C_DefaultLangCode = "en";

        private static readonly Dictionary<string, Dictionary<string, string>> cacheLangResources = new Dictionary<string, Dictionary<string, string>>();

        public static void Init_ResourceCache()
        {
            string resourceFolder = HttpContext.Current.Server.MapPath("~/App_GlobalResources");
            var dir = new DirectoryInfo(resourceFolder);
            var files = dir.GetFiles();
            
            for (int i = 0; i < files.Length; i++)
            {
                var file = files[i];
                string extension = Path.GetExtension(file.FullName).ToLower();
                
                if (extension == C_ResourceFileExtension)
                {
                    string dicKey = file.Name.ToLower(); 
                    Dictionary<string,string> resourceItems =new Dictionary<string, string>();
                    using (var reader = new ResXResourceReader(file.FullName))
                    {
                        foreach (DictionaryEntry item in reader)
                        {
                            var val = item.Value == null ? string.Empty : item.Value.ToString();
                            resourceItems.Add(item.Key.ToString(), val);
                        }
                    }
                    cacheLangResources.Add(dicKey, resourceItems);
                }
            }
        }

        public static string GetLocalLangCode()
        {
            var lang = Thread.CurrentThread.CurrentCulture.Name.Split(new[] {'-'});
            if (lang.Length == 2)
            {
                return lang[0].ToLower();
            }
            return C_DefaultLangCode;
        }

        public static string Translation(string resourceKey, string fileName = "AppResource")
        {
            if (string.IsNullOrEmpty(resourceKey))
                throw new ArgumentNullException(resourceKey);

            string lang = GetLocalLangCode();
            string defaultFileKey = string.Format("{0}{1}", fileName, C_ResourceFileExtension).ToLower();

            if (lang != C_DefaultLangCode)
            {
                var fileKey = string.Format("{0}.{1}{2}", fileName, lang, C_ResourceFileExtension).ToLower();
                Dictionary<string, string> items;

                if (cacheLangResources.TryGetValue(fileKey, out items))
                {
                    string val;
                    if (items.TryGetValue(resourceKey, out val))
                    {
                        return val;
                    }
                }
            }
            try
            {
                return cacheLangResources[defaultFileKey][resourceKey];
            }
            catch (Exception ex)
            {
                throw new NullReferenceException(string.Format("resource not found:{0},{1}", defaultFileKey, resourceKey));
            }
            
          
        }

        public static string Translation(this HtmlHelper html, string resourceKey, string fileName = "DXResource")
        {
            return Translation(resourceKey);
        }

        public static void SetCulture(this Controller controller)
        {
            var currentLang = C_DefaultLangCode; 
            const string globalLizationCookie = "DXGlobalization";
            const string cookiesLangTag = "lang";
            HttpCookie cookie = controller.HttpContext.Request.Cookies[globalLizationCookie];
            if (cookie != null)
            {
                object lang = cookie[cookiesLangTag];
                if (lang != null)
                {
                    currentLang = lang.ToString();
                }
            }
            Thread.CurrentThread.CurrentUICulture = new CultureInfo(currentLang);
            Thread.CurrentThread.CurrentCulture = CultureInfo.CreateSpecificCulture(currentLang);
        }
    }
}
