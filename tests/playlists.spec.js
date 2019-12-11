var shell = require("shelljs");
var request = require("supertest");
var app = require("../app");

const environment = process.env.NODE_ENV || "test";
const configuration = require("../knexfile")[environment];
const database = require("knex")(configuration);

describe("A user", () => {
  beforeEach(async () => {
    await database.raw("truncate table playlists cascade");
    await database.raw("truncate table favorite_songs cascade");

    const playlist = {
      title: "Test Playlist"
    };

    const playlist2 = {
      title: "Other Test Playlist"
    };

    const favoriteSong = {
      title: "I Will Not Bow",
      artist_name: "Breaking Benjamin",
      genre: "Rock",
      rating: 68
    };

    const favoriteSong2 = {
      title: "In Loving Memory",
      artist_name: "Alter Bridge",
      genre: "Rock",
      rating: 30
    };

    await database("playlists").insert(playlist, "id");
    await database("playlists").insert(playlist2, "id");
    await database("favorite_songs").insert(favoriteSong, "id");
    await database("favorite_songs").insert(favoriteSong2, "id");
  });

  afterEach(() => {
    database.raw("truncate table playlists cascade");
    database.raw("truncate table favorite_songs cascade");
  });

  describe("can POST a new playlist", () => {
    it("by passing in a playlistTitle in the body of the request", async () => {
      const body = {
        "playlistTitle": "Party"
      }

      const res = await request(app)
        .post("/api/v1/playlists")
        .send(body)

      expect(res.statusCode).toBe(201);

      expect(res.body[0]).toHaveProperty("title");
      expect(res.body[0].title).toBe("Party");
    });
  });

  describe("can't POST a new playlist", () => {
    it("if the playlist title already exists", async () => {
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

    it("if the user doesn't pass in a title", async () => {
      const body = {
        "playlistTitle": ""
      }

      const res = await request(app)
        .post("/api/v1/playlists")
        .send(body)

      expect(res.statusCode).toBe(422);
      expect(res.body.error).toBe("Please enter a valid title")
    })
  });

  describe("can GET a playlist", () => {
    it("by its id and show songs in that playlist with count and average rating", async () => {
      const playlist = await database("playlists")
        .where("title", "Test Playlist").select("id");
      const playlistId = playlist[0].id;

      const favorite = await database("favorite_songs")
        .where("title", "I Will Not Bow").select("id");
      const favoriteId = favorite[0].id;

      const favorite2 = await database("favorite_songs")
        .where("title", "In Loving Memory").select("id");
      const favoriteId2 = favorite2[0].id;

      const res = await request(app)
        .post(`/api/v1/playlists/${playlistId}/favorites/${favoriteId}`);

      const res2 = await request(app)
        .post(`/api/v1/playlists/${playlistId}/favorites/${favoriteId2}`);

      const res3 = await request(app)
        .get(`/api/v1/playlists/${playlistId}/favorites`);

      expect(res3.statusCode).toBe(200);

      expect(res3.body).toHaveProperty("id");

      expect(res3.body).toHaveProperty("title");
      expect(res3.body.title).toBe("Test Playlist");

      expect(res3.body).toHaveProperty("songCount");
      expect(res3.body.songCount).toBe(2);

      expect(res3.body).toHaveProperty("songAvgRating");
      expect(res3.body.songAvgRating).toBe(49);

      expect(res3.body).toHaveProperty("favorites")
      expect(res3.body.favorites.length).toBe(2)

      expect(res3.body.favorites[0]).toHaveProperty("title");
      expect(res3.body.favorites[0].title).toBe("I Will Not Bow");

      expect(res3.body.favorites[0]).toHaveProperty("artistName");
      expect(res3.body.favorites[0].artistName).toBe("Breaking Benjamin");

      expect(res3.body.favorites[0]).toHaveProperty("genre");
      expect(res3.body.favorites[0].genre).toBe("Rock");

      expect(res3.body.favorites[0]).toHaveProperty("rating");
      expect(res3.body.favorites[0].rating).toBe(68);

      expect(res3.body).toHaveProperty("createdAt");

      expect(res3.body).toHaveProperty("updatedAt");
    });

    it("by its ID even if there are no songs in the playlist", async () => {
      const playlist = await database("playlists")
      .where("title", "Test Playlist").select("id");
      const playlistId = playlist[0].id;

      const res = await request(app)
      .get(`/api/v1/playlists/${playlistId}/favorites`);

      expect(res.statusCode).toBe(200);

      expect(res.body).toHaveProperty("id");

      expect(res.body).toHaveProperty("title");
      expect(res.body.title).toBe("Test Playlist");

      expect(res.body).toHaveProperty("songCount");
      expect(res.body.songCount).toBe(0);

      expect(res.body).toHaveProperty("songAvgRating");
      expect(res.body.songAvgRating).toBe(0);

      expect(res.body).toHaveProperty("favorites")
      expect(res.body.favorites.length).toBe(0)

      expect(res.body).toHaveProperty("createdAt");

      expect(res.body).toHaveProperty("updatedAt");
    });
  });

  describe("can't GET a playlist", () => {
    it("if the playlist doesn't exist", async () => {
      const playlist = await database("playlists")
        .where("title", "Test Playlist").select("id");
      const playlistId = playlist[0].id;
      const wrongId = playlistId + 10;

      const res = await request(app)
        .get(`/api/v1/playlists/${wrongId}/favorites`);

        expect(res.statusCode).toBe(404);
        expect(res.body.error).toBe("No playlist found matching that ID. Try again!")
    });
  });

  describe("can GET all playlists", () => {
    it("from the playlists endpoint", async () => {
      const res = await request(app)
        .get("/api/v1/playlists");

      expect(res.statusCode).toBe(200);
      expect(res.body.length).toBe(2);

      expect(res.body[0]).toHaveProperty("id");
      expect(res.body[1]).toHaveProperty("id");

      expect(res.body[0]).toHaveProperty("title");
      expect(res.body[0].title).toBe("Test Playlist");
      expect(res.body[1].title).toBe("Other Test Playlist");

      expect(res.body[0]).toHaveProperty("createdAt");
      expect(res.body[1]).toHaveProperty("createdAt");

      expect(res.body[0]).toHaveProperty("updatedAt");
      expect(res.body[1]).toHaveProperty("updatedAt");

      expect(res.body[0]).toHaveProperty("favorites");
      expect(res.body[0].favorites).toEqual([]);
      expect(res.body[1].favorites).toEqual([]);

      expect(res.body[0]).toHaveProperty("songCount");
      expect(res.body[1]).toHaveProperty("songCount");

      expect(res.body[0]).toHaveProperty("songAvgRating");
      expect(res.body[1]).toHaveProperty("songAvgRating");
    });
  });

  describe("can edit a playlist title through a PUT request", () => {
    it("by sending a new title in the body of the request", async () => {
      const playlist = await database("playlists")
        .where("title", "Test Playlist").select("id");
      const playlistId = playlist[0].id;

      const body = {
        "playlistTitle": "Party"
      }

      const res = await request(app)
        .put(`/api/v1/playlists/${playlistId}`)
        .send(body)

      expect(res.statusCode).toBe(200);

      expect(res.body).toHaveProperty("title");
      expect(res.body.title).toBe("Party");
    });
  });

  describe("can't edit a playlist title through a PUT request", () => {
    it("with a duplicate title", async () => {
      const playlist = await database("playlists")
        .where("title", "Test Playlist").select("id");
      const playlistId = playlist[0].id;

      const body = {
        "playlistTitle": "Other Test Playlist"
      }

      const res = await request(app)
        .put(`/api/v1/playlists/${playlistId}`)
        .send(body)

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe("You already have a playlist called Other Test Playlist!")
    });

    it("with an incorrect playlist id", async () => {
      const playlist = await database("playlists")
      .where("title", "Test Playlist").select("id");
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

  describe("can DELETE a playlist", () => {
    it("by entering its ID in the url", async () => {
      const playlist = await database("playlists")
        .where("title", "Test Playlist").select("id");
      const playlistId = playlist[0].id;
      const res = await request(app)
        .delete(`/api/v1/playlists/${playlistId}`);

      expect(res.statusCode).toBe(204);
    });
  });

  describe("can't DELETE a playlist", () => {
    it ("if the playlist doesn't exist", async () => {
      const playlist = await database("playlists")
        .where("title", "Test Playlist").select("id");
      const playlistId = playlist[0].id;
      const wrongId = playlistId + 10
      const res = await request(app)
        .delete(`/api/v1/playlists/${wrongId}`);

      expect(res.statusCode).toBe(404);

      expect(res.body).toHaveProperty("error");
      expect(res.body.error).toBe("Playlist not found");
    });
  });
});
