# RROD - React, Redux, Orleans and Dotnet Core
### Exploring a new web architecture

This project is an eploration of next-generation architecture based on Dotnet Core and Javascript. When I started this, it was all very bleeding edge, but by now everything is (almost) released and ready for production!

Here is the [introductory blogpost](https://medium.com/@MaartenSikkema/exploring-a-new-web-architecture-with-react-redux-orleans-and-dotnet-core-95175be56535#.aq0ovjefc) 

This project demonstrates many technologies in context:

## Clientside
- A web front-end with universal/isomorphic rendering, using React 16 and Redux, written in Typescript
- Bootstrap based UI using [react-bootstrap](https://react-bootstrap.github.io/) and bootstrap-sass
- Animations and transitions using [ReactTransitionGroup](https://github.com/reactjs/react-transition-group) and [AnimatedJS](http://facebook.github.io/react-native/docs/animations.html)
- Asset pipeline driven by webpack 4, with Hot Module Reloading during development
- Realtime updates from the server over a SignalR Websocket connection

## Web front-end
- Webserver based on AspNet Core 2.0, running as a standalone executable
- Automatic request and use of Let's Encrypt TLS certificates on startup
- AspNet JavascriptServices middleware driving webpack during development (_requires node version 8+_)
- AspNet middleware to serve gzip-compressed static assets when possible
- AspNet Identity using a custom (Orleans based) Identity Store
- Identity Server 4 based authentication
- Middleware to protect against cross site scripting

## Actor back-end
- Actor-based back-end based on [Microsoft Orleans 2.0 (rc1)](https://github.com/dotnet/orleans)
- Using Table Storage for persisting state (install the Azure Storage emulator or configure a 'real' storage connection to run this project)
- Using Orleans Streams over an Azure Storage Queue for pushing updates from the back-end to subscribers
- Demo Actor implementing Event Sourcing, using the Redux pattern
- AspNet Distributed Cache service implemented against Orleans

## Development and Deployment
- Use VS Code or Visual Studio for development using a local dotnet environment
- Dockerfiles and VS Code tasks for local development (and debugging) using Docker Community Edition
- Kubernetes Yaml files for deployment to a Kubernetes environment, such as Azure AKS (add your own configmaps/secrets)

## See it in action
- I deployed [a version of this complete solution to Azure Kubernetes Service (AKS) here](https://rrod.sikkema.com). Kubernetes and Docker are new to me, but I think this is the way forward.
  There still are warnings about broken connections in the logs that do not happen when running locally. If someone can teach me how to correctly configure the loadbalancer in Azure AKS with WebSockets and TLS, please help me improve this.

This code should be considered experimental. It mostly works, however the project may have rough edges and has not been thoroughly tested. 
I welcome feedback!

-- Maarten