using Orleans;
using System.Threading.Tasks;
using System.Collections.Immutable;

namespace GrainInterfaces
{
    public class ClientApplication
    {
        public string DisplayName { get; set; }
        public ImmutableList<string> RedirectUris { get; set; }
        public string LogoutRedirectUri { get; set; }
        public string Secret { get; set; }
        public string Type { get; set; }

        public ClientApplication()
        {
            RedirectUris = ImmutableList<string>.Empty;
        }
    }

    public class ClientApplicationState
    {
        public string DisplayName { get; set; }
        public ImmutableList<string> RedirectUris { get; set; }
        public string LogoutRedirectUri { get; set; }
        public string Secret { get; set; }
        public string Type { get; set; }
        // public List<AtentaToken> Tokens { get; set; }

        public ClientApplicationState()
        {
            RedirectUris = ImmutableList<string>.Empty;
        }

        public static ClientApplicationState Reducer(ClientApplicationState previous, IAction action)
        {
            ClientApplicationState next;
            switch (action)
            {
                case CreateApplication createApplication:
                    next = new ClientApplicationState
                    {
                        DisplayName = createApplication.ClientApplication.DisplayName,
                        RedirectUris = createApplication.ClientApplication.RedirectUris,
                        LogoutRedirectUri = createApplication.ClientApplication.LogoutRedirectUri,
                        Secret = createApplication.ClientApplication.Secret,
                        Type = createApplication.ClientApplication.Type,
                    };
                    return next;

                case UpdateApplication updateApplication:
                    next = new ClientApplicationState
                    {
                        DisplayName = updateApplication.ClientApplication.DisplayName,
                        RedirectUris = updateApplication.ClientApplication.RedirectUris,
                        LogoutRedirectUri = updateApplication.ClientApplication.LogoutRedirectUri,
                        Secret = updateApplication.ClientApplication.Secret,
                        Type = updateApplication.ClientApplication.Type,
                    };
                    return next;

            }
            return previous;
        }
    }

    public class UpdateApplication : IAction
    {
        public ClientApplication ClientApplication { get; set; }
    }

    public class CreateApplication : IAction
    {
        public ClientApplication ClientApplication { get; set; }
    }


    public interface IClientApplicationGrain : IGrainWithStringKey
    {
        Task<ClientApplicationState> GetClientApplication();
        Task Dispatch(IAction action);
    }
}
