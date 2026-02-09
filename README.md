# NC News Seeding

## Hosted version

The API is hosted here:
https://back-end-nc-news-ek5h.onrender.com

Example endpoints:
- `/api`
- `/api/articles`
- `/api/articles/1`
- `/api/articles/1/comments`

## Project summary

NC News API is a RESTful backend service built with **Node.js**, **Express**, and **PostgreSQL**.  
It provides data for a news-style application, allowing users to:

- View articles, topics, users, and comments
- Filter and sort articles by queries
- Post and delete comments
- Update article votes
- Handle errors consistently across the API

This project was developed using **test-driven development (TDD)** with Jest and Supertest and follows a layered architecture (routers → controllers → services → models).

## Tech stack

- Node.js
- Express
- PostgreSQL
- Jest & Supertest
- pg / pg-format
- Supabase (hosted database)
- Render (API hosting)

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
