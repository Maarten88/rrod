using Orleans;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using System.Threading;
using System.Diagnostics;
using GrainInterfaces;

namespace Webapp.Identity
{
    public class OrleansUserStore : IUserStore<ApplicationUser>,
                                    IUserPasswordStore<ApplicationUser>, IUserEmailStore<ApplicationUser>,
                                    IUserLockoutStore<ApplicationUser>, IUserSecurityStampStore<ApplicationUser>,
                                    IUserPhoneNumberStore<ApplicationUser>, IUserRoleStore<ApplicationUser>,
                                    IUserTwoFactorStore<ApplicationUser>, IUserLoginStore<ApplicationUser>,
                                    IUserAuthenticationTokenStore<ApplicationUser>
    {
        private readonly IClusterClient grainClient;

        public OrleansUserStore(IClusterClient grainClient)
        {
            this.grainClient = grainClient;
        }


        public Task AddLoginAsync(ApplicationUser user, UserLoginInfo login, CancellationToken cancellationToken)
        {
            user.ExternalLogins.Add(new ExternalLoginState { LoginProvider = login.LoginProvider, ProviderKey = login.ProviderKey });
            return Task.FromResult(0);
        }

        public Task AddToRoleAsync(ApplicationUser user, string roleName, CancellationToken cancellationToken)
        {
            user.Roles.Add(roleName);
            return Task.FromResult(0);
        }

        public async Task<IdentityResult> CreateAsync(ApplicationUser user, CancellationToken cancellationToken)
        {
            // user.Id should be null here
            if (user.UserId != null)
                return IdentityResult.Failed(new IdentityError { Code = "already_exists", Description = $"Can't create a user that already has an id ({user.UserId})" });
            if (user.Registered != null)
                return IdentityResult.Failed(new IdentityError { Code = "already_registered", Description = $"Can't create a user that is already registered (at {user.Registered})" });

            user.UserId = user.NormalizedUserName;
            user.Registered = DateTimeOffset.UtcNow;

            var registerAccount = new RegisterAccountAction
            {
                IdentityState = new IdentityState
                {
                    UserName = user.UserName,
                    NormalizedUserName = user.NormalizedUserName,
                    Email = user.Email,
                    NormalizedEmail = user.NormalizedEmail,
                    EmailConfirmed = user.EmailConfirmed,
                    PhoneNumber = user.PhoneNumber,
                    PhoneNumberConfirmed = user.PhoneNumberConfirmed,
                    PasswordHash = user.PasswordHash,
                    SecurityStamp = user.SecurityStamp,
                    Registered = user.Registered,
                    LockoutEnabled = user.LockoutEnabled,
                    LockoutEnd = user.LockoutEnd,
                    AccessFailedCount = user.AccessFailedCount,
                    TwoFactorEnabled = user.TwoFactorEnabled,
                    Roles = user.Roles ?? new List<string>(),
                    ExternalLogins = user.ExternalLogins ?? new List<ExternalLoginState>(),
                    AuthenticationTokens = user.AuthenticationTokens,
                    ConcurrencyStamp = user.ConcurrencyStamp
                },
                PersonalState = user.PersonalData
            };

            try
            {
                var taskList = new List<Task>();

                var userGrain = this.grainClient.GetGrain<IUserGrain>(user.NormalizedUserName);
                await userGrain.Dispatch(registerAccount);

                var userNameIndexGrain = this.grainClient.GetGrain<IGrainIndexGrain<IUserGrain>>($"username-{user.NormalizedUserName}");
                await userNameIndexGrain.Set(userGrain);

                var emailIndexGrain = this.grainClient.GetGrain<IGrainIndexGrain<IUserGrain>>($"email-{user.NormalizedEmail}");
                await emailIndexGrain.Set(userGrain);

                foreach (var login in registerAccount.IdentityState.ExternalLogins)
                {
                    var loginIndexGrain = this.grainClient.GetGrain<IGrainIndexGrain<IUserGrain>>($"login-{login.LoginProvider}-{login.ProviderKey}");
                    taskList.Add(loginIndexGrain.Set(userGrain));
                }

                await Task.WhenAll(taskList);
            }
            catch (Exception e)
            {
                user.UserId = null;
                user.Registered = null;
                Trace.WriteLine($"Error storing user {user.NormalizedUserName}: {e.Message}");
                // return IdentityResult.Failed(new IdentityError { Code = "error_creating_user", Description = $"An error occurred trying to register user {user.Id}" });
                throw;
            }


            return IdentityResult.Success;
        }

        public Task<IdentityResult> DeleteAsync(ApplicationUser user, CancellationToken cancellationToken)
        {
            throw new NotImplementedException();
        }


        /// <summary>
        /// Creates a new token associated with the given user and defined by a unique identifier and a token type.
        /// </summary>
        /// <param name="user">The user associated with the token.</param>
        /// <param name="type">The token type.</param>
        /// <param name="cancellationToken">The <see cref="CancellationToken"/> that can be used to abort the operation.</param>
        /// <returns>
        /// A <see cref="Task"/> that can be used to monitor the asynchronous operation,
        /// whose result returns the unique identifier associated with the token.
        /// </returns>
        //public Task<string> CreateTokenAsync(ApplicationUser user, string type, CancellationToken cancellationToken)
        //{
        //if (user == null)
        //    {
        //        throw new ArgumentNullException(nameof(user));
        //    }

        //    if (string.IsNullOrEmpty(type))
        //    {
        //        throw new ArgumentException("The token type cannot be null or empty.");
        //    }

        //    var token = new AtentaToken { Type = type, Id = Guid.NewGuid().ToString() };
        //    user.Tokens.Add(token);

        //    // Save??
        //    // await Context.SaveChangesAsync(cancellationToken);

        //    return Task.FromResult(token.Id);
        //}

        /// <summary>
        /// Creates a new token associated with the given user and
        /// attached to the tokens issued to the specified client.
        /// </summary>
        /// <param name="user">The user.</param>
        /// <param name="client">The application.</param>
        /// <param name="type">The token type.</param>
        /// <param name="cancellationToken">The <see cref="CancellationToken"/> that can be used to abort the operation.</param>
        /// <returns>
        /// A <see cref="Task"/> that can be used to monitor the asynchronous operation,
        /// whose result returns the unique identifier associated with the token.
        /// </returns>
        //public virtual async Task<string> CreateTokenAsync(ApplicationUser user, string client, string type, CancellationToken cancellationToken)
        //{
        //    if (user == null)
        //    {
        //        throw new ArgumentNullException(nameof(user));
        //    }

        //    if (string.IsNullOrEmpty(client))
        //    {
        //        throw new ArgumentException("The client identifier cannot be null or empty.");
        //    }

        //    if (string.IsNullOrEmpty(type))
        //    {
        //        throw new ArgumentException("The token type cannot be null or empty.");
        //    }

        //    var grain = this.grainClient.GetGrain<IApplicationGrain>(client);
        //    var application = await grain.GetApplication();
        //    if (application == null)
        //    {
        //        throw new InvalidOperationException("The application cannot be found.");
        //    }

        //    var token = new AtentaToken { Type = type, Id = Guid.NewGuid().ToString(), Application = client };

        //    // This seems like a not-very-scalable solution...
        //    // application.Tokens.Add(token);
        //    user.Tokens.Add(token);

        //    // Context.Update(application);
        //    // Context.Update(user);

        //    // await Context.SaveChangesAsync(cancellationToken);

        //    return token.Id;
        //}

        ///// <summary>
        ///// Retrieves the token identifiers associated with a user.
        ///// </summary>
        ///// <param name="user">The user.</param>
        ///// <param name="cancellationToken">The <see cref="CancellationToken"/> that can be used to abort the operation.</param>
        ///// <returns>
        ///// A <see cref="Task"/> that can be used to monitor the asynchronous operation,
        ///// whose result returns the tokens associated with the user.
        ///// </returns>
        //public virtual async Task<IEnumerable<string>> GetTokensAsync(TUser user, CancellationToken cancellationToken)
        //{
        //    if (user == null)
        //    {
        //        throw new ArgumentNullException(nameof(user));
        //    }

        //    // Ensure that the key type can be serialized.
        //    var converter = TypeDescriptor.GetConverter(typeof(TKey));
        //    if (!converter.CanConvertTo(typeof(string)))
        //    {
        //        throw new InvalidOperationException($"The '{typeof(TKey).Name}' key type is not supported.");
        //    }

        //    var query = from entity in Users
        //                where entity.Id.Equals(user.Id)
        //                from token in entity.Tokens
        //                select token.Id;

        //    var tokens = new List<string>();

        //    foreach (var identifier in await query.ToArrayAsync())
        //    {
        //        tokens.Add(converter.ConvertToInvariantString(identifier));
        //    }

        //    return tokens;
        //}


        public void Dispose()
        {
        }

        public async Task<ApplicationUser> FindByEmailAsync(string normalizedEmail, CancellationToken cancellationToken)
        {
            var indexGrain = this.grainClient.GetGrain<IGrainIndexGrain<IUserGrain>>($"email-{normalizedEmail}");
            var userGrain = await indexGrain.Get();
            if (userGrain == null) return null;
            var userState = await userGrain.GetUserState();
            if (userState?.IdentityState.Registered != null)
                return new ApplicationUser(userGrain.GetPrimaryKeyString(), userState.IdentityState);
            else
                return null;
        }

        public async Task<ApplicationUser> FindByIdAsync(string userId, CancellationToken cancellationToken)
        {
            var userGrain = this.grainClient.GetGrain<IUserGrain>(userId.ToUpperInvariant());
            var userState = await userGrain.GetUserState();
            if (userState?.IdentityState.Registered != null)
                return new ApplicationUser(userId, userState.IdentityState);
            else
                return null;
        }

        public async Task<ApplicationUser> FindByLoginAsync(string loginProvider, string providerKey, CancellationToken cancellationToken)
        {
            var indexGrain = this.grainClient.GetGrain<IGrainIndexGrain<IUserGrain>>($"login-{loginProvider}-{providerKey}");
            var userGrain = await indexGrain.Get();
            if (userGrain == null) return null;
            var userState = await userGrain.GetUserState();
            if (userState?.IdentityState.Registered != null)
                return new ApplicationUser(userGrain.GetPrimaryKeyString(), userState.IdentityState);
            else
                return null;
        }

        public async Task<ApplicationUser> FindByNameAsync(string normalizedUserName, CancellationToken cancellationToken)
        {
            var indexGrain = this.grainClient.GetGrain<IGrainIndexGrain<IUserGrain>>($"username-{normalizedUserName}");
            var userGrain = await indexGrain.Get();
            if (userGrain == null) return null;
            var userState = await userGrain.GetUserState();
            if (userState?.IdentityState.Registered != null)
                return new ApplicationUser(userGrain.GetPrimaryKeyString(), userState.IdentityState);
            else
                return null;
        }

        public Task<int> GetAccessFailedCountAsync(ApplicationUser user, CancellationToken cancellationToken)
        {
            return Task.FromResult(user.AccessFailedCount);
        }

        public Task<string> GetEmailAsync(ApplicationUser user, CancellationToken cancellationToken)
        {
            return Task.FromResult(user.Email);
        }

        public Task<bool> GetEmailConfirmedAsync(ApplicationUser user, CancellationToken cancellationToken)
        {
            return Task.FromResult(user.EmailConfirmed);
        }

        public Task<bool> GetLockoutEnabledAsync(ApplicationUser user, CancellationToken cancellationToken)
        {
            return Task.FromResult(user.LockoutEnabled);
        }

        public Task<DateTimeOffset?> GetLockoutEndDateAsync(ApplicationUser user, CancellationToken cancellationToken)
        {
            return Task.FromResult(user.LockoutEnd);
        }

        public Task<IList<UserLoginInfo>> GetLoginsAsync(ApplicationUser user, CancellationToken cancellationToken)
        {
            var result = user.ExternalLogins.Select(login => new UserLoginInfo(login.LoginProvider, login.ProviderKey, login.LoginProvider)).ToList();
            return Task.FromResult<IList<UserLoginInfo>>(result);
        }

        public Task<string> GetNormalizedEmailAsync(ApplicationUser user, CancellationToken cancellationToken)
        {
            return Task.FromResult(user.Email.ToUpperInvariant());
        }

        public Task<string> GetNormalizedUserNameAsync(ApplicationUser user, CancellationToken cancellationToken)
        {
            return Task.FromResult(user.UserName.ToUpperInvariant());
        }

        public Task<string> GetPasswordHashAsync(ApplicationUser user, CancellationToken cancellationToken)
        {
            return Task.FromResult(user.PasswordHash);
        }

        public Task<string> GetPhoneNumberAsync(ApplicationUser user, CancellationToken cancellationToken)
        {
            return Task.FromResult(user.PhoneNumber);
        }

        public Task<bool> GetPhoneNumberConfirmedAsync(ApplicationUser user, CancellationToken cancellationToken)
        {
            return Task.FromResult(user.PhoneNumberConfirmed);
        }

        public Task<IList<string>> GetRolesAsync(ApplicationUser user, CancellationToken cancellationToken)
        {
            return Task.FromResult<IList<string>>(user.Roles);
        }

        public Task<string> GetSecurityStampAsync(ApplicationUser user, CancellationToken cancellationToken)
        {
            return Task.FromResult(user.SecurityStamp);
        }

        public Task<string> GetTokenAsync(ApplicationUser user, string loginProvider, string name, CancellationToken cancellationToken)
        {
            var tokens = user.AuthenticationTokens.Where(token => token.Name == name && token.LoginProvider == loginProvider);
            return tokens.Count() == 0 ? Task.FromResult<string>(null) : Task.FromResult(user.AuthenticationTokens.Where(token => token.Name == name && token.LoginProvider == loginProvider).First().Token);
        }

        //public Task<IEnumerable<string>> GetTokensAsync(ApplicationUser user, CancellationToken cancellationToken)
        //{
        //    return Task.FromResult(user.Tokens.Select(token => token.Id));
        //}

        public Task<bool> GetTwoFactorEnabledAsync(ApplicationUser user, CancellationToken cancellationToken)
        {
            return Task.FromResult(user.TwoFactorEnabled);
        }

        public Task<string> GetUserIdAsync(ApplicationUser user, CancellationToken cancellationToken)
        {
            return Task.FromResult(user.UserId);
        }

        public Task<string> GetUserNameAsync(ApplicationUser user, CancellationToken cancellationToken)
        {
            return Task.FromResult(user.UserName);
        }

        public Task<IList<ApplicationUser>> GetUsersInRoleAsync(string roleName, CancellationToken cancellationToken)
        {
            throw new NotImplementedException();
        }

        public Task<bool> HasPasswordAsync(ApplicationUser user, CancellationToken cancellationToken)
        {
            return Task.FromResult(!String.IsNullOrEmpty(user.PasswordHash));
        }

        public Task<int> IncrementAccessFailedCountAsync(ApplicationUser user, CancellationToken cancellationToken)
        {
            return Task.FromResult(++user.AccessFailedCount);
        }

        public Task<bool> IsInRoleAsync(ApplicationUser user, string roleName, CancellationToken cancellationToken)
        {
            return Task.FromResult(user.Roles.Any(role => role.Equals(roleName, StringComparison.OrdinalIgnoreCase)));
        }

        public Task RemoveFromRoleAsync(ApplicationUser user, string roleName, CancellationToken cancellationToken)
        {
            user.Roles.Remove(user.Roles.First(role => role.Equals(roleName, StringComparison.OrdinalIgnoreCase)));
            return Task.FromResult(0);
        }

        public Task RemoveLoginAsync(ApplicationUser user, string loginProvider, string providerKey, CancellationToken cancellationToken)
        {
            user.ExternalLogins.Remove(user.ExternalLogins.First(login => login.LoginProvider == loginProvider && login.ProviderKey == providerKey));
            return Task.FromResult(0);
        }

        public Task RemoveTokenAsync(ApplicationUser user, string loginProvider, string name, CancellationToken cancellationToken)
        {
            var tokensToRemove = user.AuthenticationTokens.Where(token => token.LoginProvider == loginProvider && token.Name == name).ToList();
            foreach (var token in tokensToRemove)
                user.AuthenticationTokens.Remove(token);
            return Task.FromResult(0);
        }

        public Task ResetAccessFailedCountAsync(ApplicationUser user, CancellationToken cancellationToken)
        {
            user.AccessFailedCount = 0;
            return Task.FromResult(0);
        }

        public Task SetEmailAsync(ApplicationUser user, string email, CancellationToken cancellationToken)
        {
            user.Email = email;
            return Task.FromResult(0);
        }

        public Task SetEmailConfirmedAsync(ApplicationUser user, bool confirmed, CancellationToken cancellationToken)
        {
            user.EmailConfirmed = confirmed;
            return Task.FromResult(0);
        }

        public Task SetLockoutEnabledAsync(ApplicationUser user, bool enabled, CancellationToken cancellationToken)
        {
            user.LockoutEnabled = enabled;
            return Task.FromResult(0);
        }

        public Task SetLockoutEndDateAsync(ApplicationUser user, DateTimeOffset? lockoutEnd, CancellationToken cancellationToken)
        {
            user.LockoutEnd = lockoutEnd;
            return Task.FromResult(0);
        }

        public Task SetNormalizedEmailAsync(ApplicationUser user, string normalizedEmail, CancellationToken cancellationToken)
        {
            user.NormalizedEmail = normalizedEmail;
            return Task.FromResult(0);
        }

        public Task SetNormalizedUserNameAsync(ApplicationUser user, string normalizedName, CancellationToken cancellationToken)
        {
            user.NormalizedUserName = normalizedName;
            return Task.FromResult(0);
        }

        public Task SetPasswordHashAsync(ApplicationUser user, string passwordHash, CancellationToken cancellationToken)
        {
            user.PasswordHash = passwordHash;
            return Task.FromResult(0);
        }

        public Task SetPhoneNumberAsync(ApplicationUser user, string phoneNumber, CancellationToken cancellationToken)
        {
            user.PhoneNumber = phoneNumber;
            return Task.FromResult(0);
        }

        public Task SetPhoneNumberConfirmedAsync(ApplicationUser user, bool confirmed, CancellationToken cancellationToken)
        {
            user.PhoneNumberConfirmed = confirmed;
            return Task.FromResult(0);
        }

        public Task SetSecurityStampAsync(ApplicationUser user, string stamp, CancellationToken cancellationToken)
        {
            user.SecurityStamp = stamp;
            return Task.FromResult(0);
        }

        public Task SetTokenAsync(ApplicationUser user, string loginProvider, string name, string value, CancellationToken cancellationToken)
        {
            // Remove first?
            user.AuthenticationTokens.Add(new AuthTokenState { Token = value, LoginProvider = loginProvider, Name = name });
            return Task.FromResult(0);
        }

        public Task SetTwoFactorEnabledAsync(ApplicationUser user, bool enabled, CancellationToken cancellationToken)
        {
            user.TwoFactorEnabled= enabled;
            return Task.FromResult(0);
        }

        public Task SetUserNameAsync(ApplicationUser user, string userName, CancellationToken cancellationToken)
        {
            user.UserName= userName;
            return Task.FromResult(0);
        }

        public async Task<IdentityResult> UpdateAsync(ApplicationUser user, CancellationToken cancellationToken)
        {
            var userGrain = this.grainClient.GetGrain<IUserGrain>(user.UserId);
           
            var update = new UpdateIdentityAction
            {
                IdentityState = new IdentityState
                {
                    UserName = user.UserName,
                    NormalizedUserName = user.NormalizedUserName,
                    Email = user.Email,
                    NormalizedEmail = user.NormalizedEmail,
                    EmailConfirmed = user.EmailConfirmed,
                    PhoneNumber = user.PhoneNumber,
                    PhoneNumberConfirmed = user.PhoneNumberConfirmed,
                    PasswordHash = user.PasswordHash,
                    SecurityStamp = user.SecurityStamp,
                    Registered = user.Registered,
                    LockoutEnabled = user.LockoutEnabled,
                    LockoutEnd = user.LockoutEnd,
                    AccessFailedCount = user.AccessFailedCount,
                    TwoFactorEnabled = user.TwoFactorEnabled,
                    Roles = user.Roles,
                    ExternalLogins = user.ExternalLogins,
                    AuthenticationTokens = user.AuthenticationTokens,
                    ConcurrencyStamp = user.ConcurrencyStamp
                }
            };
            await userGrain.Dispatch(update);
            return IdentityResult.Success;
        }
    }
}