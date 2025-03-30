# Stage 1: Build React frontend
FROM node:18 AS frontend-build
WORKDIR /app
COPY ./ClientApp/package*.json ./ClientApp/
RUN cd ./ClientApp && npm install
COPY ./ClientApp ./ClientApp
RUN cd ./ClientApp && npm run build

# Stage 2: Build ASP.NET Core backend
FROM mcr.microsoft.com/dotnet/sdk:7.0 AS backend-build
WORKDIR /src
COPY ./JobHuntX.sln ./
COPY ./JobHuntX/*.csproj ./JobHuntX/
RUN dotnet restore
COPY . .
COPY --from=frontend-build /app/ClientApp/build ./JobHuntX/wwwroot
RUN dotnet publish -c Release -o /app/publish

# Stage 3: Final image
FROM mcr.microsoft.com/dotnet/aspnet:7.0
WORKDIR /app
COPY --from=backend-build /app/publish .
ENV ASPNETCORE_URLS=http://+:5000
EXPOSE 5000
ENTRYPOINT ["dotnet", "JobHuntX.dll"]
