## Setup

[![Build Status](https://travis-ci.com/iandouglas/all-your-base.svg?branch=master)](https://travis-ci.com/iandouglas/all-your-base)

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

# set up Heroku
```
