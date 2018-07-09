FROM microsoft/dotnet:2.1-sdk-alpine AS build
RUN apk add --update nodejs nodejs-npm

FROM build AS publish
WORKDIR /build
COPY . .
WORKDIR /build/src/Webapp
RUN dotnet publish -c Release -o /app

FROM microsoft/dotnet:2.1-aspnetcore-runtime-alpine AS base
RUN apk add --update nodejs

WORKDIR /app
EXPOSE 443 80

FROM base AS final
ENV ASPNETCORE_ENVIRONMENT Production
WORKDIR /app
COPY --from=publish /app .
ENTRYPOINT ["dotnet", "Webapp.dll"]
