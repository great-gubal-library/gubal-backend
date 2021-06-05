# Gubal backend

Node.js + TypeScript backend for Gubal dashboard. Uses Nest.js framework

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

## Migrations

```bash
# Create an empty migration file
npm run migration:create -- -n NameOfTheMigration
# Run migration
npm run migration:run
# Revert migration
npm run migration:revert
```
