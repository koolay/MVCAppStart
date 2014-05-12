using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web.Mvc;
using DataAnnotationsExtensions.ClientValidation.Rules;
using DataAnnotationsExtensions.CustomValidation;

namespace DataAnnotationsExtensions.ClientValidation.Adapters
{
    public class NotEqualToAdapter : DataAnnotationsModelValidator<NotEqualToAttribute>
    {
        public NotEqualToAdapter(ModelMetadata metadata, ControllerContext context, NotEqualToAttribute attribute)
            : base(metadata, context, attribute)
        {
        }

        public override IEnumerable<ModelClientValidationRule> GetClientValidationRules()
        {
            Attribute.OtherPropertyDisplayName = GetOtherPropertyDisplayName();

            var otherProp = FormatPropertyForClientValidation(Attribute.OtherProperty);
            //We'll just use the built-in System.Web.Mvc client validation rule
            return new[] { new ModelClientValidationNotEqualRule(ErrorMessage, otherProp) };
        }

        private string GetOtherPropertyDisplayName()
        {
            if (Metadata.ContainerType != null && !String.IsNullOrEmpty(Attribute.OtherProperty))
            {
                var propertyMetaData = ModelMetadataProviders.Current.GetMetadataForProperty(() => Metadata.Model,
                                                                                             Metadata.ContainerType,
                                                                                             Attribute.OtherProperty);

                return propertyMetaData.GetDisplayName();
            }

            return Attribute.OtherProperty;
        }

        public static string FormatPropertyForClientValidation(string property)
        {
            if (property == null)
            {
                throw new ArgumentException("property");
            }
            return property;
        }
    }
}
