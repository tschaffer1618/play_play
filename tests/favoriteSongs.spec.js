var shell = require("shelljs");
var request = require("supertest");
var app = require("../app");

const environment = process.env.NODE_ENV || "test";
const configuration = require("../knexfile")[environment];
const database = require("knex")(configuration);

jest.mock("../helpers/apiHelper")

describe ("A user", () => {
  beforeEach(async () => {
    await database.raw("truncate table favorite_songs cascade");

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

    await database("favorite_songs").insert(favoriteSong, "id");
    await database("favorite_songs").insert(favoriteSong2, "id");
  });

  afterEach(() => {
    database.raw("truncate table favorite_songs cascade");
  });

  describe("can GET a favorite song", () => {
    it("with a correct song id", async () => {
      const favorite = await database("favorite_songs")
      .where("title", "I Will Not Bow").select("id");
      const favoriteSongId = favorite[0].id;
      const res = await request(app)
      .get(`/api/v1/favorites/${favoriteSongId}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.length).toBe(1);

      expect(res.body[0]).toHaveProperty("title");
      expect(res.body[0].title).toBe("I Will Not Bow");

      expect(res.body[0]).toHaveProperty("artistName");
      expect(res.body[0].artistName).toBe("Breaking Benjamin");

      expect(res.body[0]).toHaveProperty("genre");
      expect(res.body[0].genre).toBe("Rock");

      expect(res.body[0]).toHaveProperty("rating");
      expect(res.body[0].rating).toBe(68);
    });
  });

  describe("can't get a song", () => {
    it("that hasn't been favorited", async () => {
      const favorite = await database("favorite_songs")
      .where("title", "I Will Not Bow").select("id");
      const favoriteSongId = favorite[0].id;
      const wrongId = favoriteSongId + 10
      const res = await request(app)
      .get(`/api/v1/favorites/${wrongId}`);

      expect(res.statusCode).toBe(404);

      expect(res.body).toHaveProperty("error");
      expect(res.body.error).toBe("Song not found");
    });
  });

  describe("can GET all favorited songs", () => {
    it("from the favorites endpoint", async () => {
      const res = await request(app)
      .get("/api/v1/favorites");

      expect(res.statusCode).toBe(200);
      expect(res.body.length).toBe(2);

      expect(res.body[0]).toHaveProperty("title");
      expect(res.body[0].title).toBe("I Will Not Bow");
      expect(res.body[1].title).toBe("In Loving Memory");

      expect(res.body[0]).toHaveProperty("artistName");
      expect(res.body[0].artistName).toBe("Breaking Benjamin");
      expect(res.body[1].artistName).toBe("Alter Bridge");

      expect(res.body[0]).toHaveProperty("genre");
      expect(res.body[0].genre).toBe("Rock");
      expect(res.body[1].genre).toBe("Rock");

      expect(res.body[0]).toHaveProperty("rating");
      expect(res.body[0].rating).toBe(68);
      expect(res.body[1].rating).toBe(30);
    });
  });

  describe("can DELETE a favorite song", () => {
    it("with a correct song id", async () => {
      const favorite = await database("favorite_songs")
      .where("title", "I Will Not Bow").select("id");
      const favoriteSongId = favorite[0].id;
      const res = await request(app)
      .delete(`/api/v1/favorites/${favoriteSongId}`);

      expect(res.statusCode).toBe(204);
    });
  });

  describe("can't DELETE a favorite song", () => {
    it("that hasn't been favorited", async () => {
      const favorite = await database("favorite_songs")
      .where("title", "I Will Not Bow").select("id");
      const favoriteSongId = favorite[0].id;
      const wrongId = favoriteSongId + 10
      const res = await request(app)
      .delete(`/api/v1/favorites/${wrongId}`);

      expect(res.statusCode).toBe(404);

      expect(res.body).toHaveProperty("error");
      expect(res.body.error).toBe("Song not found");
    });
  });

  describe("can POST a new favorite song", () => {
    it("by providing the title and artistName in the body", async () => {
      const body = {
        "title": "Don't Stop Me Now",
        "artistName": "Queen"
      }

      const res = await request(app)
      .post("/api/v1/favorites")
      .send(body)

      expect(res.statusCode).toBe(201);

      expect(res.body).toHaveProperty("title");
      expect(res.body.title).toBe("Don't Stop Me Now");

      expect(res.body).toHaveProperty("artistName");
      expect(res.body.artistName).toBe("Queen");

      expect(res.body).toHaveProperty("genre");
      expect(res.body.genre).toBe("Pop/Rock");

      expect(res.body).toHaveProperty("rating");
      expect(res.body.rating).toBe(81)
    });

    it("by providing the title and artistName in the body without a genre given by the API", async () => {
      const body = {
        "title": "Under Pressure",
        "artistName": "Vanilla Ice vs. Queen Bowie"
      }

      const res = await request(app)
      .post("/api/v1/favorites")
      .send(body)

      expect(res.statusCode).toBe(201);

      expect(res.body).toHaveProperty("title");
      expect(res.body.title).toBe("Ice Ice Baby Under Pressure (two tracker)");

      expect(res.body).toHaveProperty("artistName");
      expect(res.body.artistName).toBe("Vanilla Ice vs. Queen & Bowie");

      expect(res.body).toHaveProperty("genre");
      expect(res.body.genre).toBe("Unknown");

      expect(res.body).toHaveProperty("rating");
      expect(res.body.rating).toBe(1)
    });
  });

  describe("can't POST a new favorite song", () => {
    it("if that song has already been favorited", async () => {
      const body = {
        "title": "Don't Stop Me Now",
        "artistName": "Queen"
      }

      const res = await request(app)
      .post("/api/v1/favorites")
      .send(body)

      const res2 = await request(app)
      .post("/api/v1/favorites")
      .send(body)

      expect(res2.statusCode).toBe(400);
      expect(res2.body.message).toBe("You have already favorited Don't Stop Me Now by Queen!");
    });

    it("if Musixmatch has no record of that song in their API", async () => {
      const body = {
        "title": "fred",
        "artistName": "Queen"
      }

      const res = await request(app)
      .post("/api/v1/favorites")
      .send(body)

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe("No songs found matching that title and artist. Try again!");
    });
  });
})
