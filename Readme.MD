# Installation
1. cp .env.example .env

## Docker Development Environments

#### Mongo

`docker run --rm --name cs_mongo -d -p 27017:27017 mongo`

#### Redis

`docker run --rm --name cs_redis -d -p 6379:6379 -e ALLOW_EMPTY_PASSWORD=yes bitnami/redis:latest`

## Docker Prod Flags

#### Mongo

- Data Persistence: `-v ~/docker/volumes/mongo:/data/db`

#### Redis

- Make sure you are setting password: `-e REDIS_PASSWORD=password123`
- Data Persistence: `-v ~/docker/volumes/redis:/bitnami/redis/data`

#### General

- `Restart Always` is suggested if you are not using an orchestration system: `--restart always`
