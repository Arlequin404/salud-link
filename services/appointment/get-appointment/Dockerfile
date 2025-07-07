FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY get-appointment.csproj ./
RUN dotnet restore ./get-appointment.csproj

COPY . .
RUN dotnet publish ./get-appointment.csproj -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=build /app/publish .
EXPOSE 8021
ENV ASPNETCORE_URLS=http://+:8021
ENTRYPOINT ["dotnet", "get-appointment.dll"]
