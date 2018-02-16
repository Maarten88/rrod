using Microsoft.AspNetCore.Mvc.ModelBinding;
using System.Collections.Generic;
using System.Linq;
using Webapp.Models;

namespace Webapp.Helpers
{
    public static class ModelStateExtensions
    {
        public static ApiResult AsApiResult(this ModelStateDictionary modelState)
        {
            var result = new ApiResult();

            foreach (var key in modelState.Keys)
            {
                var val = modelState[key];
                if (val.ValidationState == ModelValidationState.Invalid)
                {
                    result.Errors.Add(key, new List<string>(val.Errors.Select(error => error.ErrorMessage)));
                }
            }
            result.Message = $"{modelState.ErrorCount} error(s) found";
            return result;
        }

        public static ApiModel<TValue> AsApiModel<TValue>(this ModelStateDictionary modelState, TValue val) where TValue : class
        {
            return new ApiModel<TValue>(val, modelState.AsApiResult());
        }
    }
}
