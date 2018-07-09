# RROD - React, Redux, Orleans and Dotnet Core
### Exploring a new web architecture

This project is an eploration of next-generation architecture based on Dotnet Core and Javascript. When I started this, it was all very bleeding edge, but I have maintained this repositories as these products matured, and now everything is released and ready for production!

Here is the [introductory blogpost](https://medium.com/@MaartenSikkema/exploring-a-new-web-architecture-with-react-redux-orleans-and-dotnet-core-95175be56535). 
There are follow-up posts on my implementation of [Let's Encrypt Certificates](https://medium.com/@MaartenSikkema/automatically-request-and-use-lets-encrypt-certificates-in-dotnet-core-9d0d152a59b5), 
the [React, Redux, and Typescript-based frontend](https://medium.com/@MaartenSikkema/using-react-redux-and-webpack-with-dotnet-core-to-build-a-modern-web-frontend-7e2d091b3ba), and the 
[Orleans Actor-based backend](https://medium.com/@MaartenSikkema/using-dotnet-core-orleans-redux-and-websockets-to-build-a-scalable-realtime-back-end-cd0b65ec6b4d).
I also added Dockerfiles and deployed this solution to a Kubernetes cluster. The config files for that (minus secrets) are in the [deploy](https://github.com/Maarten88/rrod/tree/master/deploy) folder.

This project demonstrates many technologies in context:

## Clientside
- A web front-end with universal/isomorphic rendering, using React 16 and Redux, written in Typescript
- Bootstrap based UI using [react-bootstrap](https://react-bootstrap.github.io/) and bootstrap-sass
- Animations and transitions using [ReactTransitionGroup](https://github.com/reactjs/react-transition-group) and [AnimatedJS](http://facebook.github.io/react-native/docs/animations.html)
- Asset pipeline driven by webpack 4, with Hot Module Reloading during development
- Realtime updates from the server over a SignalR Websocket connection

## Web front-end
- Webserver based on AspNet Core 2.1, running as a standalone executable
- Automatic request and use of Let's Encrypt TLS certificates on startup
- AspNet JavascriptServices middleware driving webpack during development (_requires node version 8+_)
- AspNet middleware to serve gzip-compressed static assets when possible
- AspNet Identity using a custom (Orleans based) Identity Store
- DistributedCache and DataProtection services implemented against Orleans backend
- Identity Server 4 based authentication
- Middleware to protect against cross site scripting

## Actor back-end
- Actor-based back-end based on [Microsoft Orleans 2.0](https://github.com/dotnet/orleans)
- Using Table Storage for persisting state (install the Azure Storage emulator or configure a 'real' storage connection to run this project)
- Using Orleans Streams over an Azure Storage Queue for pushing updates from the back-end to subscribers
- Demo Actor implementing Event Sourcing, re-using the Redux pattern in the backend

## Docker / Kubernetes based deployment
- Use VS Code or Visual Studio for development using a local dotnet environment
- Dockerfiles and VS Code tasks for local development and debugging using Docker Community Edition
- Kubernetes Yaml files for deployment to a Kubernetes cluster, such as Azure AKS (add your own configmaps/secrets)

## Run it yourself
1. Install dotnet core 2.1 (or higher) and nodejs 8 (or higher).
2. Create a secrets.json file, put it in the right place (in Windows, its `%AppData%\Roaming\Microsoft\UserSecrets\rrod-secrets\secrets.json`, on OSX, it's in `~/.microsoft/usersecrets/rrod-secrets/secrets.json`). 
A storage account first has to be created in [Microsoft Azure](https://portal.azure.com). On Windows, you can alternatively install the Azure Storage Emulator and put "UseDevelopmentStorage=true" for the storage connection strings. The SMTP connection string is not really necessary.
It is possible to configure Orleans with other types of clustering that do not use Azure Storage (such as [native Kubernetes Clustering](https://github.com/OrleansContrib/Orleans.Clustering.Kubernetes)) with a few code changes. The ReduxGrain base class (used for storing users and counter values) is hardcoded against Azure storage and really needs the ReduxConnectionString.
The minimum secrets file contains:
```
{
  "ConnectionStrings": {
    "DataConnectionString": "DefaultEndpointsProtocol=https;AccountName=[AZURE STORAGE ACCOUNT];AccountKey=[STORAGE KEY];EndpointSuffix=core.windows.net",
    "ReduxConnectionString": "DefaultEndpointsProtocol=https;AccountName=[AZURE STORAGE ACCOUNT];AccountKey=[STORAGE KEY];EndpointSuffix=core.windows.net",
    "SmtpConnectionString": "Host=[SMTP HOST];UserName=[SMTP USERNAME];Password=[SMTP PASSWORD]"
  },
  "AcmeSettings": {
    "EmailAddress": "[YOUR EMAIL]",
    "PfxPassword": "[A RANDOM PASSWORD]"
  }
}
```

3. in src/OrleansHost, run `dotnet run`
4. in src/Webapp, run `npm install` (or `yarn`), then `dotnet run`

Using VS Code or Visual Studio you can also do this from inside the IDE.

# Disclaimer
This code should be considered experimental. It works, however the project may have rough edges and has not been thoroughly tested.
I welcome feedback!

-- Maarten