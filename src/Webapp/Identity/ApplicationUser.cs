using System;
using System.Collections.Generic;
using GrainInterfaces;

namespace Webapp.Identity
{
    public class ApplicationUser
    {
        public string UserId { get; set; }
        public string UserName { get; set; }
        public string NormalizedUserName { get; set; }
        public string Email { get; set; }
        public string NormalizedEmail { get; set; }
        public bool EmailConfirmed { get; set; }
        public string PhoneNumber { get; set; }
        public bool PhoneNumberConfirmed { get; set; }
        public string PasswordHash { get; set; }
        public string SecurityStamp { get; set; }
        public DateTimeOffset? Registered { get; set; }
        public bool LockoutEnabled { get; set; }
        public DateTimeOffset? LockoutEnd { get; set; }
        public int AccessFailedCount { get; set; }
        public bool TwoFactorEnabled { get; set; }
        public int InvitesAvailable { get; set; }
        public List<string> Roles { get; set; } = new List<string>();
        public List<ExternalLoginState> ExternalLogins { get; set; } = new List<ExternalLoginState>();
        public List<AuthTokenState> AuthenticationTokens { get; set; } = new List<AuthTokenState>();
        public string ConcurrencyStamp { get; set; }
        public PersonalState PersonalData { get; set; }

        public override string ToString() => this.UserId;

        public ApplicationUser()
        {
        }

        public ApplicationUser(string userId, IdentityState identityData)
        {
            UserId = userId;
            UserName = identityData.UserName;
            NormalizedUserName = identityData.NormalizedUserName;
            Email = identityData.Email;
            NormalizedEmail = identityData.NormalizedEmail;
            EmailConfirmed = identityData.EmailConfirmed;
            PhoneNumber = identityData.PhoneNumber;
            PhoneNumberConfirmed = identityData.PhoneNumberConfirmed;
            PasswordHash = identityData.PasswordHash;
            SecurityStamp = identityData.SecurityStamp;
            Registered = identityData.Registered;
            LockoutEnabled = identityData.LockoutEnabled;
            LockoutEnd = identityData.LockoutEnd;
            AccessFailedCount = identityData.AccessFailedCount;
            TwoFactorEnabled = identityData.TwoFactorEnabled;
            Roles = identityData.Roles;
            ExternalLogins = identityData.ExternalLogins;
            AuthenticationTokens = identityData.AuthenticationTokens;
            ConcurrencyStamp = identityData.ConcurrencyStamp;
        }
    }

    public class ApplicationUserLogin
    {
        public string LoginProvider { get; set; }
        public string ProviderDisplayName { get; set; }
        public string ProviderKey { get; set; }
        public string UserId { get; set; }
    }

    public class ApplicationToken
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string LoginProvider { get; set; }
    }

    public class UserRole
    {
        public string Role { get; set; }
    }
}