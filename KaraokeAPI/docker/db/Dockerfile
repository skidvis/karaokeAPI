FROM mysql:5.7
COPY setup.sql /docker-entrypoint-initdb.d/01-setup.sql
COPY songs.sql /docker-entrypoint-initdb.d/02-songs.sql