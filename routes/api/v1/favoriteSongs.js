var express = require('express');
var router = express.Router();

var formatHelper = require("../../../helpers/formatHelper");
var apiHelper = require("../../../helpers/apiHelper");

const environment = process.env.NODE_ENV || 'development';
const configuration = require('../../../knexfile')[environment];
const database = require('knex')(configuration);

const getFavoriteSong = router.get("/:id", async (request, response) => {
  const favoriteId = request.params.id;
  const favoriteSong = await database("favorite_songs").where("id", favoriteId);
  if (favoriteSong[0]) {
    response.status(200).send(formatHelper.formatSong(favoriteSong));
  } else {
    response.status(404).json({ error: 'Song not found'});
  }
})

const getAllFavoriteSongs = router.get("/", async (request, response) => {
  const favSongs = await database("favorite_songs").select("id", "title", "artist_name as artistName", "genre", "rating")
  response.status(200).send(favSongs)
})

const deleteFavoriteSong = router.delete("/:id", async (request, response) => {
  const songId = request.params.id;
  const favorite = await database("favorite_songs").where( "id", songId )
  if (favorite[0]) {
    const delSong = await database("favorite_songs").del().where({ id: songId })
    response.status(204).send();
  } else {
    return response.status(404).json({ error: "Song not found" });
  }
})

const createFavoriteSong = router.post("/", (request, response) => {
  const title = request.body.title;
  const artist = request.body.artistName;

  for (let requiredParameter of ["title", "artistName"]) {
    if (!request.body[requiredParameter]) {
      return response.status(422).send({
        error: `Expeted format: { title: <String>, artistName: <String> } You're missing the "${requiredParameter}" property!`
      });
    }
  }

  apiHelper.apiSong(title, artist)
    .then(song => {
      if (song.error){
        response.status(400).send(song)
      } else {
        database("favorite_songs").where({title: song.title, artist_name: song.artistName})
          .then(existingFavorite => {
            if (existingFavorite[0]) {
              response.status(400).json({ message: `You have already favorited ${song.title} by ${song.artistName}!`})
            } else {
              database("favorite_songs").insert({title: song.title, artist_name: song.artistName, genre: song.genre, rating: song.rating})
              .then(dataPromise => {
                database("favorite_songs").where({title: song.title})
                .then(favoriteSong => {
                  response.status(201).json(formatHelper.formatSong(favoriteSong)[0])
                })
              })
            }
          })
          .catch(error => {response.status(500).json({ error });
        });
      }
    })
})

module.exports = {
  getFavoriteSong,
  getAllFavoriteSongs,
  deleteFavoriteSong,
  createFavoriteSong
};
