# Installation

1. cp .env.example .env
2. Run Mongo
3. Run Redis
4. run `yarn start`

# Endpoints

- Subscribe to Email List to Get Daily Reports of Dependency Updates

[ POST ] `/api/repo/subscribe`

```
{
    "email": "caner@sezgin.com",
    "repo": "CanerSezgin/reky"
}
```

- Get Dependencies <br>
  Tries to fetch `SupportedFiles: [package.json, composer.json]`, get dependencies from each SupportedFile and return stale Dependencies with additional file information.

[ POST ] `/api/repo/dependencies`

```
{
    "repo": "CanerSezgin/reky"
}
```

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
