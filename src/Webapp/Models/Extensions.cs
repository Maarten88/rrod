using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace Webapp.Models
{
    public static class ModelStateExtensions
    {
        public static ApiResult AsApiResult(this ModelStateDictionary modelState)
        {
            var result = new ApiResult();

            foreach (var val in modelState.Values)
            {
                if (val.ValidationState == ModelValidationState.Invalid)
                {
                    result.Errors.Add(val.ToString(), new List<string>(val.Errors.Select(error => error.ErrorMessage)));
                }
            }
            result.Message = $"{modelState.ErrorCount} error(s) found";
            return result;
        }
    }
}