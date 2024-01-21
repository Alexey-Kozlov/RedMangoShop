FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app
EXPOSE 5026

COPY ["API/RedMangoShop.csproj", "API/"]
RUN dotnet restore "API/RedMangoShop.csproj"
COPY API/* ./API/
WORKDIR /app/API
RUN dotnet publish -c release -o /app/build --no-restore

FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app/build ./
ENTRYPOINT ["dotnet", "RedMangoShop.dll"]
