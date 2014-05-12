using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web.Mvc;

namespace DataAnnotationsExtensions.ClientValidation.Adapters
{
    public class TextLengthAttributeAdapter : DataAnnotationsModelValidator<TextLengthAttribute>
    {
        public TextLengthAttributeAdapter(ModelMetadata metadata, ControllerContext context, TextLengthAttribute attribute)
            : base(metadata, context, attribute)
        {
        }

        public override IEnumerable<ModelClientValidationRule> GetClientValidationRules()
        {
            return new[] { new ModelClientValidationStringLengthRule(ErrorMessage, Attribute.MinimumLength, Attribute.MaximumLength), };
        }
    }
}
