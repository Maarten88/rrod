FROM microsoft/dotnet:2.0-sdk AS build
RUN apt-get -qq update
RUN curl -sL https://deb.nodesource.com/setup_8.x | bash -
RUN apt-get install -y nodejs

FROM build AS publish
WORKDIR /build
COPY . .
WORKDIR /build/src/Webapp
RUN dotnet publish -c Release -o /app

FROM microsoft/aspnetcore:2.0 AS base
RUN apt-get -qq update && apt-get -qqy --no-install-recommends install wget gnupg git unzip
RUN curl -sL https://deb.nodesource.com/setup_8.x | bash -
RUN apt-get install -y nodejs

WORKDIR /app
EXPOSE 443 80

FROM base AS final
ENV ASPNETCORE_ENVIRONMENT Production
WORKDIR /app
COPY --from=publish /app .
ENTRYPOINT ["dotnet", "Webapp.dll"]
