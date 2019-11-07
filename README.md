## Setup

[![Build Status](https://travis-ci.com/turingschool-examples/all-your-base.svg?branch=master)](https://travis-ci.com/turingschool-examples/all-your-base)

```
npm install

# set up dev database
createdb publications_dev
knex migrate:latest
knex seed:run

# set up test database
createdb publications_test
knex migrate:latest --env test

# run your tests
npm test


# Production

# set up Heroku

heroku run bash
# and then
npm install
nom install -g knex
knex migrate:latest

```
