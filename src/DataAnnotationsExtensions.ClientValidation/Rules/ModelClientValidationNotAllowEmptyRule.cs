using System.Web.Mvc;

namespace DataAnnotationsExtensions.ClientValidation.Rules
{
    public class ModelClientValidationNotAllowEmptyRule : ModelClientValidationRule
    {
        public ModelClientValidationNotAllowEmptyRule(string errorMsg)
        {
            ErrorMessage = errorMsg;
            ValidationType = "required";
        }
    }
}
