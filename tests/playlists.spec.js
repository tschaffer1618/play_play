var shell = require('shelljs');
var request = require("supertest");
var app = require('../app');

const environment = process.env.NODE_ENV || 'test';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);

describe('Test the playlists path', () => {
  beforeEach(async () => {
    await database.raw('truncate table playlists cascade');

    const playlist = {
      title: 'Test Playlist'
    };

    const playlist2 = {
      title: 'Other Test Playlist'
    };

    await database('playlists').insert(playlist, 'id');
    await database('playlists').insert(playlist2, 'id');
  });

  afterEach(() => {
    database.raw('truncate table playlists cascade');
  });

  //tests here
})