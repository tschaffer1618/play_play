var shell = require('shelljs');
var request = require("supertest");
var app = require('../app');

const environment = process.env.NODE_ENV || 'test';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);


describe('Test the favorites path', () => {
  beforeEach(async () => {
    await database.raw('truncate table favorite_songs cascade');

    const favoriteSong = {
      title: 'I Will Not Bow',
      artist_name: 'Breaking Benjamin',
      genre: 'Rock',
      rating: 68
    };

    await database('favorite_songs').insert(favoriteSong, 'id');
  });

  afterEach(() => {
    database.raw('truncate table favorite_songs cascade');
  });

  describe('test favorite DELETE one by id', () => {
    it('happy path', async () => {
      const favorite = await database('favorite_songs')
        .where('title', 'I Will Not Bow').select('id');
      const favoriteSongId = favorite[0].id;
      const res = await request(app)
        .delete(`/api/v1/favorites/${favoriteSongId}`);
        console.log(res)

      expect(res.statusCode).toBe(204);
    });
  });
});
