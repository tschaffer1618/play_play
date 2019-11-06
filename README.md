## Setup

```
npm install

createdb publications-dev
knex migrate:latest

createdb publications-test
knex migrate:latest --env test

npm test

```
