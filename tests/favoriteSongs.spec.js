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
    const favoriteSong2 = {
      title: 'In Loving Memory',
      artist_name: 'Alter Bridge',
      genre: 'Rock',
      rating: 30
    };

    await database('favorite_songs').insert(favoriteSong, 'id');
    await database('favorite_songs').insert(favoriteSong2, 'id');
  });

  afterEach(() => {
    database.raw('truncate table favorite_songs cascade');
  });

  describe('test favorite song GET one by id', () => {
    it('happy path', async () => {
      const favorite = await database('favorite_songs')
        .where('title', 'I Will Not Bow').select('id');
      const favoriteSongId = favorite[0].id;
      const res = await request(app)
        .get(`/api/v1/favorites/${favoriteSongId}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.length).toBe(1);

      expect(res.body[0]).toHaveProperty('title');
      expect(res.body[0].title).toBe('I Will Not Bow');

      expect(res.body[0]).toHaveProperty('artistName');
      expect(res.body[0].artistName).toBe('Breaking Benjamin');

      expect(res.body[0]).toHaveProperty('genre');
      expect(res.body[0].genre).toBe('Rock');

      expect(res.body[0]).toHaveProperty('rating');
      expect(res.body[0].rating).toBe(68);
    });

    it('sad path', async () => {
      const favorite = await database('favorite_songs')
        .where('title', 'I Will Not Bow').select('id');
      const favoriteSongId = favorite[0].id;
      const wrongId = favoriteSongId + 10
      const res = await request(app)
        .get(`/api/v1/favorites/${wrongId}`);

      expect(res.statusCode).toBe(404);

      expect(res.body).toHaveProperty('error');
      expect(res.body.error).toBe('Song not found');
    });
  });

  describe('test favorite songs GET all', () => {
    it('happy path', async () => {
      const res = await request(app)
        .get(`/api/v1/favorites`);

      expect(res.statusCode).toBe(200);
      expect(res.body.length).toBe(2);

      expect(res.body[0]).toHaveProperty('title');
      expect(res.body[0].title).toBe('I Will Not Bow');
      expect(res.body[1].title).toBe('In Loving Memory');

      expect(res.body[0]).toHaveProperty('artistName');
      expect(res.body[0].artistName).toBe('Breaking Benjamin');
      expect(res.body[1].artistName).toBe('Alter Bridge');

      expect(res.body[0]).toHaveProperty('genre');
      expect(res.body[0].genre).toBe('Rock');
      expect(res.body[1].genre).toBe('Rock');

      expect(res.body[0]).toHaveProperty('rating');
      expect(res.body[0].rating).toBe(68);
      expect(res.body[1].rating).toBe(30);
    });
  });

  describe('test favorite DELETE one by id', () => {
    it('happy path', async () => {
      const favorite = await database('favorite_songs')
        .where('title', 'I Will Not Bow').select('id');
      const favoriteSongId = favorite[0].id;
      const res = await request(app)
        .delete(`/api/v1/favorites/${favoriteSongId}`);

      expect(res.statusCode).toBe(204);
    });

    it('sad path', async () => {
      const favorite = await database('favorite_songs')
        .where('title', 'I Will Not Bow').select('id');
      const favoriteSongId = favorite[0].id;
      const wrongId = favoriteSongId + 10
      const res = await request(app)
        .delete(`/api/v1/favorites/${wrongId}`);

      expect(res.statusCode).toBe(404);

      expect(res.body).toHaveProperty('error');
      expect(res.body.error).toBe("Song not found");
    });
  });
});
