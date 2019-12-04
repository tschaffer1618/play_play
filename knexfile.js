// Update with your config settings.

module.exports = {

  development: {
    client: 'pg',
    connection: 'postgres://localhost/favorite_songs_dev',
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
    connection: 'postgres://localhost/favorite_songs_test',
    migrations: {
      directory: './db/migrations'
    },
    useNullAsDefault: true
  },
  production: {
    client: 'pg',
    connection: 'postgres://cnmweupyhagrfn:84fc3729f018ad54e571aec70b361fd17d1eba601666937fec30d98f6c15eb65@ec2-54-225-195-3.compute-1.amazonaws.com:5432/d3qpnkg3hf64pd',
    migrations: {
      directory: './db/migrations'
    },
    useNullAsDefault: true
  },
  staging: {
    client: 'pg',
    connection: 'postgres://pcfnpbacvozmev:a5473d00ab934d6fd7bc72f93a6bd3401530fe53cb9f4832a9968fc0ad44d774@ec2-54-227-249-202.compute-1.amazonaws.com:5432/dcam6dsddarvjb',
    migrations: {
      directory: './db/migrations'
    },
    useNullAsDefault: true
  }
};
