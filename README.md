# RROD - React, Redux, Orleans and Dotnet Core
### Exploring a new web architecture

This project is an eploration of next-generation architecture based on Dotnet Core and Javascript

Here is an [introductory blogpost](https://medium.com/@MaartenSikkema/exploring-a-new-web-architecture-with-react-redux-orleans-and-dotnet-core-95175be56535#.aq0ovjefc) 

This project demonstrates many technologies in context:

## Clientside
- A web front-end with universal/isomorphic rendering, using React and Redux, written in Typescript
- Bootstrap based UI using react-bootstrap and bootstrap-sass
- Animations and transitions using react-motion
- Asset pipeline driven by webpack, with Hot Module Reloading during development
- Realtime updates from the server over a SignalR Websocket connection

## Web front-end
- Webserver based on Aspnet Core 2.0, running as a standalone executable
- Automatic request and use of Let's Encrypt TLS certificates on startup
- AspNet JavascriptServices middleware driving webpack during development
- AspNet middleware to serve gzip-compressed static assets when possible
- AspNet Identity using a custom Identity Store
- Identity Server 4 based authentication
- Middleware to protect against cross site scripting

## Actor back-end
- Actor-based back-end based on Microsoft Orleans 2.0
- Using Table Storage for persisting state (install the Azure Storage emulator to run this project)
- Demo Actor implementing Event Sourcing, using the Redux pattern
- AspNet Distributed Cache service implemented against Orleans

This code should be considered experimental. It mostly works, but it has dependencies that are alpha quality, 
the project has several rough edges and has not been thoroughly tested. I welcome feedback!

-- Maarten