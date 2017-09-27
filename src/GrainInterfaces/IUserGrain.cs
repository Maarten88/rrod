using Orleans;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace GrainInterfaces
{
    public enum Gender
    {
        Unknown = 0,
        Male = 1,
        Female = 2,
        Other = 9
    }

    public class InviteState
    {
        public string InviteCode { get; set; }
        public int InvitesAvailable { get; set; }
    }

    public class PersonalState
    {
        public Gender Gender { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
    }

    public class KeyState
    {
        public string PublicKey { get; set; }
        public string PrivateKey { get; set; }
        public bool HighSecurity { get; set; }
        public bool AnonymousUser { get; set; }
    }

    [Serializable]
    public class IdentityState
    {
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
        public List<string> Roles { get; set; }
        public List<ExternalLoginState> ExternalLogins { get; set; }
        public List<AuthTokenState> AuthenticationTokens { get; set; }
        public string ConcurrencyStamp { get; set; }
    }

    public class ExternalLoginState
    {
        public string LoginProvider { get; set; }
        public string ProviderKey { get; set; }
    }

    public class AuthTokenState
    {
        public string LoginProvider { get; set; }
        public string Name { get; set; }
        public string Token { get; set; }
    }

    public class DeveloperState
    {
        public List<string> OwnedAppIds { get; set; }
    }

    [Serializable]
    public class UserState
    {
        public IdentityState IdentityState { get; set; }
        public PersonalState PersonalState { get; set; }
        public InviteState InviteState { get; set; }
        public DeveloperState DeveloperState { get; set; }

        public static UserState Reducer(UserState state, IAction action)
        {
            UserState newState;
            switch (action)
            {
                case RegisterAccountAction registerAccount:
                    newState = new UserState
                    {
                        IdentityState = registerAccount.IdentityState,
                        PersonalState = registerAccount.PersonalState,
                        InviteState = state?.InviteState,
                        DeveloperState = state?.DeveloperState
                    };
                    return newState;

                case UpdateIdentityAction updateIdentityData:
                    newState = new UserState
                    {
                        IdentityState = updateIdentityData.IdentityState,
                        PersonalState = state.PersonalState,
                        InviteState = state?.InviteState,
                        DeveloperState = state?.DeveloperState
                    };
                    return newState;
            }
            return state;
        }
    }

    [Serializable]
    public class RegisterAccountAction : IAction
    {
        public IdentityState IdentityState { get; set; }
        public PersonalState PersonalState { get; set; }
    }

    [Serializable]
    public class UpdateIdentityAction : IAction
    {
        public IdentityState IdentityState { get; set; }
    }

    [Serializable]
    public class UpdatePersonalStateAction : IAction
    {
        public PersonalState PersonalState { get; set; }
    }

    public interface IUserGrain : IGrainWithStringKey
    {
        Task<UserState> GetUserState();
        Task Dispatch(IAction action, bool delaySave = false);
    }
}
