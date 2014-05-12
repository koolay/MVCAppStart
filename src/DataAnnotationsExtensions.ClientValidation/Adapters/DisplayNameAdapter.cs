using System.Collections.Generic;
using System.Web.Mvc;
using DataAnnotationsExtensions.ClientValidation.Rules;
using DataAnnotationsExtensions.CustomValidation;

namespace DataAnnotationsExtensions.ClientValidation.Adapters
{
    public class DisplayNameAdapter : DataAnnotationsModelValidator<DisplayNameAttribute>
    {
        public DisplayNameAdapter(ModelMetadata metadata, ControllerContext context, DisplayNameAttribute attribute)
            : base(metadata, context, attribute)
        {
        }

        public override IEnumerable<ModelClientValidationRule> GetClientValidationRules()
        {
            return new[] { new ModelClientValidationRegexRule(ErrorMessage, Attribute.Regex) };
        }
    }
}
