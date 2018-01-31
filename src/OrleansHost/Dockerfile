FROM microsoft/aspnetcore:2.0 AS base
WORKDIR /app

FROM microsoft/aspnetcore-build:2.0 AS build
WORKDIR /src
COPY *.sln ./
COPY src/OrleansHost/OrleansHost.csproj src/OrleansHost/
COPY src/GrainInterfaces/GrainInterfaces.csproj src/GrainInterfaces/
COPY src/Grains/Grains.csproj src/Grains/
RUN dotnet restore
COPY . .
WORKDIR /src/src/OrleansHost
#RUN dotnet build -c Release -o /app
#
FROM build AS publish
RUN dotnet publish -c Release -o /app

FROM base AS final
WORKDIR /app
COPY --from=publish /app .
ENTRYPOINT ["dotnet", "OrleansHost.dll"]
