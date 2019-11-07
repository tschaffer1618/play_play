# All your Express base are belong to us

[![Build Status](https://travis-ci.com/turingschool-examples/all-your-base.svg?branch=master)](https://travis-ci.com/turingschool-examples/all-your-base)

## Initial setup
`npm install`

#### Set up your local database
```
createdb publications_dev
knex migrate:latest
knex seed:run
```

#### Set up your test database
```
createdb publications_test
knex migrate:latest --env test
```

## How to run your tests
`npm test`

## Setting up your production environment
- Update your `knex.js` file to use your Heroku database instance
- Run the following commands to get started:
```
heroku run bash
npm install
nom install -g knex
knex migrate:latest
```
