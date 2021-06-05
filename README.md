# Estetic API

Node.js + TypeScript API for Estetic frontend. Uses Nest.js framework. These instructions will contain detailed information on necessary steps to get up and running with the project.

## First steps

- Clone the repository
- Install dependencies with `npm install`

## Running the backend locally

```bash
# Start a dockerized MariaDB
docker-compose up

# Install dependencies
npm i

# Run migrations and seed
npm run migration:run
npm run seed

# Run development watch mode
npm run start:debug
```

## DigitalOcean deploy

### Stage

```bash
npm run docker:update:stage
```

## Migrations

```bash
# Create an empty migration file
npm run migration:create -- -n NameOfTheMigration
# Run migration
npm run migration:run
# Revert migration
npm run migration:revert
```
