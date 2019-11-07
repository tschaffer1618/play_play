// Update with your config settings.

module.exports = {

  development: {
    client: 'pg',
    connection: 'postgres://localhost/publications_dev',
    migrations: {
      directory: './db/migrations'
    },
    seeds: {
      directory: './db/seeds/dev'
    },
    useNullAsDefault: true
  },
  test: {
    client: 'pg',
    connection: 'postgres://localhost/publications_test',
    migrations: {
      directory: './db/migrations'
    },
    useNullAsDefault: true
  },
  production: {
    client: 'pg',
    connection: 'postgres://sasczswyekkqas:9d3367042c8739f39cf869df4ab031fdb653d8381e2302e3a109e7cdc566637c@ec2-174-129-253-53.compute-1.amazonaws.com:5432/d4oqepk9oarmc5',
    migrations: {
      directory: './db/migrations'
    },
    useNullAsDefault: true
  }
};
