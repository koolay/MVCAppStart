using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web.Mvc;

namespace DataAnnotationsExtensions.ClientValidation.Rules
{
    public class ModelClientValidationNotEqualRule : ModelClientValidationRule
    {
        public ModelClientValidationNotEqualRule(string errorMessage, object other)
        {
            ErrorMessage = errorMessage;
            ValidationType = "notequal";
            ValidationParameters["other"] = other;
        }
    }
}
