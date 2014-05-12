using System;
using System.ComponentModel.DataAnnotations;
using System.Text.RegularExpressions;
using App.Extensions;

namespace DataAnnotationsExtensions.CustomValidation
{
    [AttributeUsage(AttributeTargets.Property | AttributeTargets.Field | AttributeTargets.Parameter, AllowMultiple = false)]
    public class DisplayNameAttribute : DataTypeAttribute
    {
        private const string _patten = @"^[A-Za-z0-9]{5,}$";
        private static readonly Regex _regex = new Regex(_patten, RegexOptions.Compiled | RegexOptions.IgnoreCase);
        public string Regex
        {
            get
            {
                return _patten;
            }
        }
        
        public DisplayNameAttribute() : base(DataType.Text)
        {
            
        }
        public override string FormatErrorMessage(string name)
        {
            ErrorMessage = GlobalizationHelper.Translation("NicknamesMayOnlyContain5AlphanumericCharacters");
            return base.FormatErrorMessage(name);
        }

        public override bool IsValid(object value)
        {
            if (value == null)
            {
                return true;
            }

            var valueAsString = value as string;

            return valueAsString != null && _regex.Match(valueAsString).Success && valueAsString.Length >= 5;
        }
    }
}
