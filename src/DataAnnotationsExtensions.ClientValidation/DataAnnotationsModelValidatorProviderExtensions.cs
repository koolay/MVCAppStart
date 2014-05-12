using System.Web.Mvc;
using DataAnnotationsExtensions.ClientValidation.Adapters;
using DataAnnotationsExtensions.CustomValidation;

namespace DataAnnotationsExtensions.ClientValidation
{
    public static class DataAnnotationsModelValidatorProviderExtensions
    {
        public static void RegisterValidationExtensions()
        {
            DataAnnotationsModelValidatorProvider.RegisterAdapter(typeof(EmailAttribute), typeof(EmailAttributeAdapter));
            //DataAnnotationsModelValidatorProvider.RegisterAdapter(typeof(UrlAttribute), typeof(UrlAttributeAdapter));
            //DataAnnotationsModelValidatorProvider.RegisterAdapter(typeof(CreditCardAttribute), typeof(CreditCardAttributeAdapter));
            DataAnnotationsModelValidatorProvider.RegisterAdapter(typeof(EqualToAttribute), typeof(EqualToAttributeAdapter));
            //DataAnnotationsModelValidatorProvider.RegisterAdapter(typeof(FileExtensionsAttribute), typeof(FileExtensionsAttributeAdapter));
            //DataAnnotationsModelValidatorProvider.RegisterAdapter(typeof(NumericAttribute), typeof(NumericAttributeAdapter));
            //DataAnnotationsModelValidatorProvider.RegisterAdapter(typeof(DigitsAttribute), typeof(DigitsAttributeAdapter));
            //DataAnnotationsModelValidatorProvider.RegisterAdapter(typeof(MinAttribute), typeof(MinAttributeAdapter));
            //DataAnnotationsModelValidatorProvider.RegisterAdapter(typeof(MaxAttribute), typeof(MaxAttributeAdapter));
            //DataAnnotationsModelValidatorProvider.RegisterAdapter(typeof(DateAttribute), typeof(DateAttributeAdapter));
            //DataAnnotationsModelValidatorProvider.RegisterAdapter(typeof(IntegerAttribute), typeof(IntegerAttributeAdapter));
            //DataAnnotationsModelValidatorProvider.RegisterAdapter(typeof(CuitAttribute), typeof(CuitAttributeAdapter));
            //DataAnnotationsModelValidatorProvider.RegisterAdapter(typeof(YearAttribute), typeof(YearAttributeAdapter));
            DataAnnotationsModelValidatorProvider.RegisterAdapter(typeof(NotAllowEmptyAttribute), typeof(NotAllowEmptyAttributeAdapter));
            DataAnnotationsModelValidatorProvider.RegisterAdapter(typeof(TextLengthAttribute), typeof(TextLengthAttributeAdapter));
            DataAnnotationsModelValidatorProvider.RegisterAdapter(typeof(DisplayNameAttribute), typeof(DisplayNameAdapter));
            DataAnnotationsModelValidatorProvider.RegisterAdapter(typeof(NotEqualToAttribute), typeof(NotEqualToAdapter));
            
        }
    }
}
