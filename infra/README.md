infra
===

## Requirements

- Docker
- Docker Compose
- Hasura CLI

## Getting Started

```shell
$ docker-compose up -d
```

Available to access Hasura console.
Admin password is `hasura`.

- http://localhost:20080/
- http://localhost:20081/ for testing

## Add/Modify a table

Edit DDL file: `postgresql/1_create_databases.sql`.

Update number of tables defined in health check command.

`docker-compose.yml`

> test: ["CMD-SHELL", "test `psql -U postgres tsukedaicho_test -c '\\dt' -t | wc -l` = %HERE%"]

- `%HERE%`: Number of tables + 1

Apply changes to docker containers in order to refresh database.

```shell
$ docker-compose down && docker-compose up -d
```

Fix metadata on Hasura console.
And re-export metadata using Hasura CLI.

```shell
$ cd hasura
$ hasura md export
```
