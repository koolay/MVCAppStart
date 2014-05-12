using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web.Mvc;
using DataAnnotationsExtensions.ClientValidation.Rules;

namespace DataAnnotationsExtensions.ClientValidation.Adapters
{
    public class NotAllowEmptyAttributeAdapter : DataAnnotationsModelValidator<NotAllowEmptyAttribute>
    {
        public NotAllowEmptyAttributeAdapter(ModelMetadata metadata, ControllerContext context, NotAllowEmptyAttribute attribute)
            : base(metadata, context, attribute)
        {
        }

        public override IEnumerable<ModelClientValidationRule> GetClientValidationRules()
        {
            return new[] { new ModelClientValidationNotAllowEmptyRule(ErrorMessage) };
        }
    }
}
