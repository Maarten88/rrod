FROM microsoft/dotnet:2.1-sdk-alpine AS publish
WORKDIR /build
COPY . .
WORKDIR /build/src/OrleansHost
RUN dotnet publish -c Release -o /app

FROM microsoft/dotnet:2.1-runtime-alpine AS final

ENV ASPNETCORE_ENVIRONMENT Production
WORKDIR /app
COPY --from=publish /app .
ENTRYPOINT ["dotnet", "OrleansHost.dll"]
