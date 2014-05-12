using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using App.Extensions;

namespace DataAnnotationsExtensions.CustomValidation
{
    [AttributeUsage(AttributeTargets.Property | AttributeTargets.Field | AttributeTargets.Parameter,
        AllowMultiple = false)]
    public class DisplayNameMinLengthValidation : DataTypeAttribute
    {
        public DisplayNameMinLengthValidation() : base(DataType.Text)
        {

        }

        public override string FormatErrorMessage(string name)
        {
            ErrorMessage = GlobalizationHelper.Translation("NicknameMustContainAtLeast5Characters");
            return base.FormatErrorMessage(name);
        }


        public override bool IsValid(object value)
        {
            if (value == null)
            {
                return true;
            }

            var valueAsString = value as string;
            return valueAsString != null && value.ToString().Length >= 5;

        }

    }
}
