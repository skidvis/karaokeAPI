# KaraokeAPI

KaraokeAPI is a browser-based karaoke song catalog and request queue. Guests can search the catalog, add songs to the queue, and save favorites in local storage. Administrators can manage the queue and song catalog.

## Features

- Search up to 100 matching songs
- Add a song and singer to the live queue
- Refresh the queue automatically every two seconds
- Save browser-local favorites
- Reorder or remove queued songs
- Add or remove songs from the catalog
- Back up MySQL data to Dropbox on a schedule

## Technology

- ASP.NET Core 2.0 MVC
- Entity Framework Core 2.0
- MySQL 5.7
- Vue 2, jQuery, and Bootstrap 4
- Docker Compose

This project uses legacy, unsupported framework and container versions. Run it only in an appropriately isolated environment unless those dependencies have been upgraded.

## Run with Docker Compose

### Prerequisites

- Docker
- Docker Compose

### 1. Configure MySQL and backups

From the repository root, create the local environment file:

```bash
cd KaraokeAPI
cp .env.sample .env
```

Edit `.env` and set each value. Keep `MYSQL_DATABASE` set to `karaokeAPI`, since the database initialization scripts use that name.

```dotenv
MYSQL_ROOT_PASSWORD=replace-me
MYSQL_DATABASE=karaokeAPI
MYSQL_USER=karaoke
MYSQL_PASSWORD=replace-me
MYSQL_HOST=db
DROPBOX_ACCESS_TOKEN=replace-me
SCHEDULE=@daily
```

The `dropbox` service requires a valid Dropbox access token. If backups are not needed, remove or disable that service in your local Compose configuration.

### 2. Configure the application

Create `appsettings.json` in the application directory. Its connection string must use `db`, the Compose service name, as the server:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "server=db;userid=karaoke;password=replace-me;database=karaokeAPI;"
  },
  "Keys": {
    "AdminKey": "replace-with-a-private-admin-key"
  },
  "Logging": {
    "IncludeScopes": false,
    "LogLevel": {
      "Default": "Warning"
    }
  }
}
```

The credentials must match the values in `.env`. Both local configuration files are ignored by Git.

### 3. Start the application

```bash
docker compose up --build
```

Open [http://localhost](http://localhost). MySQL is also exposed on port `3306` for local administration.

On its first start, MySQL creates the schema and imports the bundled song catalog. Database files persist in `KaraokeAPI/mysql/`.

## Administration

Enter the configured `AdminKey` as a song search term to create an administrator session. Reload the page after the key is accepted to display catalog controls.

Treat this application as trusted-network software. Its administrative and queue-management routes were not designed with modern authorization protections.

## HTTP endpoints

- `GET /api/queue`: List active queue entries.
- `POST /api/queue`: Add a queue entry.
- `DELETE /api/queue/{id}`: Remove a queue entry.
- `POST /api/kick/{id}`: Move a queue entry to the end.
- `POST /api/search`: Search the song catalog.
- `POST /api/add`: Manage catalog songs in an administrator session.

Example queue request:

```bash
curl -X POST http://localhost/api/queue \
  -H 'Content-Type: application/json' \
  -d '{"singer":"Alex","song":"Dancing Queen"}'
```

Example search request:

```bash
curl -X POST http://localhost/api/search \
  -H 'Content-Type: application/json' \
  -d '"queen"'
```

## Stop the application

```bash
docker compose down
```

To reset the local database, stop the services and delete `KaraokeAPI/mysql/`. The next start imports the bundled catalog again.
