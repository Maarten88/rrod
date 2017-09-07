// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.


using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;

namespace Webapp.Account
{
    [JsonObject]
    public class LoginResponseModel : ApiModel
    {
        [JsonProperty(DefaultValueHandling = DefaultValueHandling.Ignore)]
        public bool IsLockedOut { get; set; } = false;
        [JsonProperty(DefaultValueHandling = DefaultValueHandling.Ignore)]
        public bool RequiresTwoFactor { get; set; } = false;
        [JsonProperty(DefaultValueHandling = DefaultValueHandling.Ignore)]
        public bool IsNotAllowed { get; set; } = false;
    }
}