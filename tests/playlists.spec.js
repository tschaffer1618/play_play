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

  describe('test playlist DELETE one by id', () => {
    it('can delete a playlist by its ID', async () => {
      const playlist = await database('playlists')
        .where('title', 'Test Playlist').select('id');
      const playlistId = playlist[0].id;
      const res = await request(app)
        .delete(`/api/v1/playlists/${playlistId}`);

      expect(res.statusCode).toBe(204);
    });

    it ("cannot delete a playlist that doesn't exist", async () => {
      const playlist = await database('playlists')
        .where('title', 'Test Playlist').select('id');
      const playlistId = playlist[0].id;
      const wrongId = playlistId + 10
      const res = await request(app)
        .delete(`/api/v1/playlists/${wrongId}`);

      expect(res.statusCode).toBe(404);

      expect(res.body).toHaveProperty('error');
      expect(res.body.error).toBe("Playlist not found");
    });
  });

  describe('test playlists GET all', () => {
    it('happy path', async () => {
      const res = await request(app)
        .get(`/api/v1/playlists`);

      expect(res.statusCode).toBe(200);
      expect(res.body.length).toBe(2);

      expect(res.body[0]).toHaveProperty('id');
      expect(res.body[1]).toHaveProperty('id');

      expect(res.body[0]).toHaveProperty('title');
      expect(res.body[0].title).toBe('Test Playlist');
      expect(res.body[1].title).toBe('Other Test Playlist');

      expect(res.body[0]).toHaveProperty('createdAt');
      expect(res.body[1]).toHaveProperty('createdAt');

      expect(res.body[0]).toHaveProperty('updatedAt');
      expect(res.body[1]).toHaveProperty('updatedAt');
    });
  });
})

