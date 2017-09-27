using System;
using Newtonsoft.Json;

namespace Webapp.Models
{
    [JsonObject(MemberSerialization = MemberSerialization.OptIn)]
    public class ApiModel
    {
        [JsonProperty]
        public ApiResult Result { get; set; }

        public ApiModel()
        {
        }
        public ApiModel(ApiResult result)
        {
            this.Result = result;
        }
        public ApiModel(Exception e, bool includeExceptions)
        {
            this.Result = ApiResult.AsException(e, includeExceptions);
        }
        public ApiModel(AggregateException e, bool includeExceptions)
        {
            this.Result = ApiResult.AsException(e, includeExceptions);
        }

        // Helpers
        public static ApiModel AsError(string errorField, string errorMessage)
        {
            return new ApiModel(ApiResult.AsError(errorField, errorMessage));
        }
        public static ApiModel AsError(string errorMessage, int errorCode = 0)
        {
            return new ApiModel(ApiResult.AsError(errorMessage, errorCode));
        }
        public static ApiModel AsSuccess(string message = null)
        {
            return new ApiModel(ApiResult.AsSuccess(message));
        }

        public static ApiModel AsException(Exception exception, bool includeExceptions = false)
        {
            return new ApiModel(ApiResult.AsException(exception, includeExceptions));
        }

        public static ApiModel AsException(AggregateException exception, bool includeExceptions = false)
        {
            return new ApiModel(ApiResult.AsException(exception, includeExceptions));
        }
    }
}
