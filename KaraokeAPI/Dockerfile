FROM microsoft/aspnetcore-build:2.0 AS build-env
WORKDIR /code/app

ENV DOTNET_USE_POLLING_FILE_WATCHER 1
# copy csproj and restore as distinct layers
COPY *.csproj .
#RUN dotnet restore

# copy everything else and build
# COPY . ./
# RUN dotnet publish -c Release -o out

# build runtime image
# FROM microsoft/aspnetcore:2.0
# WORKDIR /app
# COPY --from=build-env /app/out .
# ENTRYPOINT ["dotnet", "KaraokeAPI.dll"]

ENTRYPOINT dotnet restore && dotnet watch run --no-restore