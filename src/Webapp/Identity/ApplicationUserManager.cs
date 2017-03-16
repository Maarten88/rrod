using GrainInterfaces;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Security.Claims;

namespace Webapp.Identity
{
    public class ApplicationUserManager : UserManager<ApplicationUser>
    {
        public ApplicationUserManager(
            IUserStore<ApplicationUser> store, 
            IOptions<IdentityOptions> options, 
            IPasswordHasher<ApplicationUser> hasher, 
            IEnumerable<IUserValidator<ApplicationUser>> userValidators, 
            IEnumerable<IPasswordValidator<ApplicationUser>> passwordValidators, 
            ILookupNormalizer keyNormalizer, 
            IdentityErrorDescriber errors, 
            IServiceProvider services, 
            ILogger<UserManager<ApplicationUser>> logger) : base(store, options, hasher, userValidators, passwordValidators, keyNormalizer, errors, services, logger)
        { }

        public override Task<IList<Claim>> GetClaimsAsync(ApplicationUser user)
        {
            return base.GetClaimsAsync(user);
        }

        public override bool SupportsQueryableUsers => false;
        public override bool SupportsUserClaim => false;
    }
}
