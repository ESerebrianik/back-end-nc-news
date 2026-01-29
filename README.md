# NC News Seeding

## Environment setup

This project uses two PostgreSQL databases: one for development and one for testing.

Create the following files in the root of the project:

### .env.development
PGDATABASE=nc_news

### .env.test
PGDATABASE=nc_news_test

These files are ignored by Git and must be created locally.

## Running the project

Install dependencies:
npm install

Create the databases:
npm run setup-dbs

Seed the development database:
npm run seed-dev

Run tests:
npm test
