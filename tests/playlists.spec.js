var shell = require('shelljs');
var request = require("supertest");
var app = require('../app');

const environment = process.env.NODE_ENV || 'test';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);

describe('Test the playlists path', () => {
  beforeEach(async () => {
    await database.raw('truncate table playlists cascade');
    await database.raw('truncate table favorite_songs cascade');

    const playlist = {
      title: 'Test Playlist'
    };

    const playlist2 = {
      title: 'Other Test Playlist'
    };

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

    await database('playlists').insert(playlist, 'id');
    await database('playlists').insert(playlist2, 'id');
    await database('favorite_songs').insert(favoriteSong, 'id');
    await database('favorite_songs').insert(favoriteSong2, 'id');
  });

  afterEach(() => {
    database.raw('truncate table playlists cascade');
    database.raw('truncate table favorite_songs cascade');
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

  describe('test playlists GET one by id', () => {
    it('happy path with favorites', async () => {
      const playlist = await database('playlists')
        .where('title', 'Test Playlist').select('id');
      const playlistId = playlist[0].id;

      const favorite = await database('favorite_songs')
        .where('title', 'I Will Not Bow').select('id');
      const favoriteId = favorite[0].id;

      const favorite2 = await database('favorite_songs')
        .where('title', 'In Loving Memory').select('id');
      const favoriteId2 = favorite2[0].id;

      const res = await request(app)
        .post(`/api/v1/playlists/${playlistId}/favorites/${favoriteId}`);

      const res2 = await request(app)
        .post(`/api/v1/playlists/${playlistId}/favorites/${favoriteId2}`);

      const res3 = await request(app)
        .get(`/api/v1/playlists/${playlistId}/favorites`);

      expect(res3.statusCode).toBe(200);

      expect(res3.body).toHaveProperty('id');

      expect(res3.body).toHaveProperty('title');
      expect(res3.body.title).toBe('Test Playlist');

      expect(res3.body).toHaveProperty('songCount');
      expect(res3.body.songCount).toBe(2);

      expect(res3.body).toHaveProperty('songAvgRating');
      expect(res3.body.songAvgRating).toBe(49);

      expect(res3.body).toHaveProperty('favorites')
      expect(res3.body.favorites.length).toBe(2)

      expect(res3.body.favorites[0]).toHaveProperty('title');
      expect(res3.body.favorites[0].title).toBe('I Will Not Bow');

      expect(res3.body.favorites[0]).toHaveProperty('artistName');
      expect(res3.body.favorites[0].artistName).toBe('Breaking Benjamin');

      expect(res3.body.favorites[0]).toHaveProperty('genre');
      expect(res3.body.favorites[0].genre).toBe('Rock');

      expect(res3.body.favorites[0]).toHaveProperty('rating');
      expect(res3.body.favorites[0].rating).toBe(68);

      expect(res3.body).toHaveProperty('createdAt');

      expect(res3.body).toHaveProperty('updatedAt');
    });

    it('happy path with no favorites', async () => {
      const playlist = await database('playlists')
        .where('title', 'Test Playlist').select('id');
      const playlistId = playlist[0].id;

      const res = await request(app)
        .get(`/api/v1/playlists/${playlistId}/favorites`);

      expect(res.statusCode).toBe(200);

      expect(res.body).toHaveProperty('id');

      expect(res.body).toHaveProperty('title');
      expect(res.body.title).toBe('Test Playlist');

      expect(res.body).toHaveProperty('songCount');
      expect(res.body.songCount).toBe(0);

      expect(res.body).toHaveProperty('songAvgRating');
      expect(res.body.songAvgRating).toBe(0);

      expect(res.body).toHaveProperty('favorites')
      expect(res.body.favorites.length).toBe(0)

      expect(res.body).toHaveProperty('createdAt');

      expect(res.body).toHaveProperty('updatedAt');
    });

    it('sad path', async () => {
      const playlist = await database('playlists')
        .where('title', 'Test Playlist').select('id');
      const playlistId = playlist[0].id;
      const wrongId = playlistId + 10;

      const res = await request(app)
        .get(`/api/v1/playlists/${wrongId}/favorites`);

        expect(res.statusCode).toBe(404);
        expect(res.body.error).toBe("No playlist found matching that ID. Try again!")
    });
  });

  describe('test playlist POST', () => {
    it('can create a playlist', async () => {
      const body = {
        "playlistTitle": "Party"
      }

      const res = await request(app)
        .post("/api/v1/playlists")
        .send(body)

      expect(res.statusCode).toBe(201);

      expect(res.body[0]).toHaveProperty('title');
      expect(res.body[0].title).toBe("Party");
    });

    it("can't create a playlist that's already been created", async () => {
      const body = {
        "playlistTitle": "Party"
      }

      const res = await request(app)
        .post("/api/v1/playlists")
        .send(body)

      const res2 = await request(app)
        .post("/api/v1/playlists")
        .send(body)

      expect(res2.statusCode).toBe(400);
      expect(res2.body.message).toBe("You already have a playlist called Party!")
    })
  });

  describe('test playlist PUT', () => {
    it('can update a playlist', async () => {
      const playlist = await database('playlists')
        .where('title', 'Test Playlist').select('id');
      const playlistId = playlist[0].id;

      const body = {
        "playlistTitle": "Party"
      }

      const res = await request(app)
        .put(`/api/v1/playlists/${playlistId}`)
        .send(body)

      expect(res.statusCode).toBe(200);

      expect(res.body).toHaveProperty('title');
      expect(res.body.title).toBe("Party");
    });

    it("can't update a playlist with a duplicate name", async () => {
      const playlist = await database('playlists')
        .where('title', 'Test Playlist').select('id');
      const playlistId = playlist[0].id;

      const body = {
        "playlistTitle": "Other Test Playlist"
      }

      const res = await request(app)
        .put(`/api/v1/playlists/${playlistId}`)
        .send(body)

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe("You already have a playlist called Other Test Playlist!")
    })

    it("can't update a playlist if an incorrect id is sent", async () => {
      const playlist = await database('playlists')
        .where('title', 'Test Playlist').select('id');
      const playlistId = playlist[0].id;
      const wrongId = playlistId + 10;

      const body = {
        "playlistTitle": "Random Name"
      }

      const res = await request(app)
        .put(`/api/v1/playlists/${wrongId}`)
        .send(body)

      expect(res.statusCode).toBe(404);
      expect(res.body.error).toBe("No playlist found matching that id. Try again!")
    })
  });
})
