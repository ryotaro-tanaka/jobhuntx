# Stage 1: Build React frontend
FROM node:18 AS frontend-build
WORKDIR /app
COPY ./client-app/package*.json ./client-app/
RUN cd ./client-app && npm install
COPY ./client-app ./client-app
RUN cd ./client-app && npm run build

# Stage 2: Build ASP.NET Core backend
FROM mcr.microsoft.com/dotnet/sdk:7.0 AS backend-build
WORKDIR /src
COPY ./JobHuntX/JobHuntX.csproj ./JobHuntX/
RUN dotnet restore ./JobHuntX/JobHuntX.csproj
COPY . .
COPY --from=frontend-build /app/client-app/build ./JobHuntX/wwwroot
RUN dotnet publish ./JobHuntX/JobHuntX.csproj -c Release -o /app/publish

# Stage 3: Final image
FROM mcr.microsoft.com/dotnet/aspnet:7.0
WORKDIR /app
COPY --from=backend-build /app/publish .
ENV ASPNETCORE_URLS=http://+:5000
EXPOSE 5000
ENTRYPOINT ["dotnet", "JobHuntX.dll"]
