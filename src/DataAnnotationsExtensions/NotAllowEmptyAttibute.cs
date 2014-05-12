using System;
using System.ComponentModel.DataAnnotations;
using App.Extensions;

namespace DataAnnotationsExtensions
{
    [AttributeUsage(AttributeTargets.Property, AllowMultiple = false)]
    public class NotAllowEmptyAttribute: DataTypeAttribute
    {
     
        public NotAllowEmptyAttribute() : base(DataType.Text)
        {
            
        }

        public override string FormatErrorMessage(string name)
        {
            this.ErrorMessage = GlobalizationHelper.Translation("Required");
            return base.FormatErrorMessage(name);
        }

        public override bool IsValid(object value)
        {
            if (value == null)
            {
                return false;
            }

            // only check string length if empty strings are not allowed
            var stringValue = value as string;
            if (stringValue != null)
            {
                return stringValue.Trim().Length != 0;
            }

            return true;
        }
    }
}
