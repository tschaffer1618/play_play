var shell = require('shelljs');
var request = require("supertest");
var app = require('../app');

const environment = process.env.NODE_ENV || 'test';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);

describe('Test creating playlist_songs', () => {
  beforeEach(async () => {
    await database.raw('truncate table playlists cascade');
    await database.raw('truncate table favorite_songs cascade');

    const playlist = {
      title: 'Test Playlist'
    };

    const favorite = {
      title: 'I Will Not Bow',
      artist_name: 'Breaking Benjamin',
      genre: 'Rock',
      rating: 68
    };

    await database('playlists').insert(playlist, 'id');
    await database('favorite_songs').insert(favorite, 'id');
  });

  afterEach(() => {
    database.raw('truncate table playlists cascade');
    database.raw('truncate table favorite_songs cascade');
  });

  describe('test playlist_songs POST', () => {
    it('can create a playlist_song', async () => {
      const playlist = await database('playlists')
        .where('title', 'Test Playlist').select('id');
      const playlistId = playlist[0].id;

      const favorite = await database('favorite_songs')
        .where('title', 'I Will Not Bow').select('id');
      const favoriteId = favorite[0].id;

      const res = await request(app)
        .post(`/api/v1/playlists/${playlistId}/favorites/${favoriteId}`);

      console.log(res)
      expect(res.statusCode).toBe(201);

      expect(res.body).toHaveProperty('success');
      expect(res.body.success).toBe("I Will Not Bow has been added to Test Playlist!");
    });

    it("can't create a playlist_song that's already been created", async () => {
      const playlist = await database('playlists')
        .where('title', 'Test Playlist').select('id');
      const playlistId = playlist[0].id;

      const favorite = await database('favorite_songs')
        .where('title', 'I Will Not Bow').select('id');
      const favoriteId = favorite[0].id;

      const res = await request(app)
        .post(`/api/v1/playlists/${playlistId}/favorites/${favoriteId}`);

      const res2 = await request(app)
        .post(`/api/v1/playlists/${playlistId}/favorites/${favoriteId}`);

      expect(res2.statusCode).toBe(400);
      expect(res2.body.message).toBe("I Will Not Bow is already in Test Playlist!")
    })

    it("can't create a playlist_song with a wrong playlist id", async () => {
      const playlist = await database('playlists')
        .where('title', 'Test Playlist').select('id');
      const playlistId = playlist[0].id;
      const wrongId = playlistId + 10;

      const favorite = await database('favorite_songs')
        .where('title', 'I Will Not Bow').select('id');
      const favoriteId = favorite[0].id;

      const res = await request(app)
        .post(`/api/v1/playlists/${wrongId}/favorites/${favoriteId}`);

      expect(res.statusCode).toBe(404);
      expect(res.body.error).toBe("No playlist found matching that ID. Try again!")
    })

    it("can't create a playlist_song with a wrong song id", async () => {
      const playlist = await database('playlists')
        .where('title', 'Test Playlist').select('id');
      const playlistId = playlist[0].id;

      const favorite = await database('favorite_songs')
        .where('title', 'I Will Not Bow').select('id');
      const favoriteId = favorite[0].id;
      const wrongId = favoriteId + 10;

      const res = await request(app)
        .post(`/api/v1/playlists/${playlistId}/favorites/${wrongId}`);

      expect(res.statusCode).toBe(404);
      expect(res.body.error).toBe("No song found matching that ID. Try again!")
    })
  });
})
