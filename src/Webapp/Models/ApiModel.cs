using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;

namespace Webapp.Models
{
    [JsonObject]
    public class ApiModel<TValue> where TValue : class
    {
        public ApiResult Result { get; set; }

        [JsonProperty(DefaultValueHandling = DefaultValueHandling.Ignore)]
        public TValue Value { get; private set; }

        public ApiModel(TValue val)
        {
            this.Value = val;
            this.Result = ApiResult.SuccessResult;
        }
        public ApiModel(TValue val, ApiResult result)
        {
            this.Result = result;
            this.Value = val;
        }
        public ApiModel(Exception e, bool includeExceptions)
        {
            this.Result = ApiResult.FromException(e, includeExceptions);
        }

        // Helpers
        public static ApiModel<TValue> AsError(string errorField, string errorMessage)
        {
            return new ApiModel<TValue>(null, ApiResult.AsError(errorField, errorMessage));
        }
        public static ApiModel<TValue> AsError(string errorMessage, int errorCode = 0)
        {
            return new ApiModel<TValue>(null, ApiResult.AsError(errorMessage, errorCode));
        }
        public static ApiModel<TValue> AsError(string errorMessage, TValue val)
        {
            return new ApiModel<TValue>(val, ApiResult.AsError(errorMessage));
        }
        public static ApiModel<TValue> AsSuccess(TValue val, string message = null)
        {
            return new ApiModel<TValue>(val, ApiResult.AsSuccess(message));
        }

        public static ApiModel<TValue> FromException(Exception exception, bool includeExceptions = false)
        {
            return new ApiModel<TValue>(null, ApiResult.FromException(exception, includeExceptions));
        }
    }

    public partial class ApiModel
    {
        public static ApiModel<TValue> AsSuccess<TValue>(TValue val, string message = null) where TValue : class
        {
            return new ApiModel<TValue>(val, ApiResult.AsSuccess(message));
        }
        public static ApiModel<TValue> AsError<TValue>(TValue val, string message = null) where TValue : class
        {
            return new ApiModel<TValue>(val, ApiResult.AsError(message));
        }
        public static ApiModel<TValue> FromException<TValue>(TValue val, Exception e, bool includeExceptions = false) where TValue : class
        {
            return new ApiModel<TValue>(val, ApiResult.FromException(e, includeExceptions));
        }
    }
}

