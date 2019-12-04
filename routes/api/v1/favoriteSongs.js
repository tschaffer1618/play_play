var express = require('express');
var router = express.Router();

var formatHelper = require("../../../helpers/formatHelper");
var apiHelper = require("../../../helpers/apiHelper");

const environment = process.env.NODE_ENV || 'development';
const configuration = require('../../../knexfile')[environment];
const database = require('knex')(configuration);

const getFavoriteSong = router.get('/:id', (request, response) => {
  const favoriteId = request.params.id
  database('favorite_songs').where('id', favoriteId)
    .then((favoriteSong) => {
      if (favoriteSong[0]) {
        response.status(200).send(formatHelper.formatSong(favoriteSong));
      } else {
        response.status(404).json({ error: 'Song not found'});
      }
    })
    .catch((error) => {
      response.status(500).json({ error });
    });
});

const getAllFavoriteSongs = router.get('/', (request, response) => {
  database('favorite_songs').select("id", "title", "artist_name as artistName", "genre", "rating")
    .then((favoriteSongs) => {
      response.status(200).send(favoriteSongs);
    })
    .catch((error) => {
      response.status(500).json({ error });
    });
});

const deleteFavoriteSong = router.delete("/:id", (request, response) => {
  const songId = request.params.id;

  database("favorite_songs").where("id", songId)
    .then(favorite => {
      if (favorite[0]) {
        database("favorite_songs").del().where({ id: songId })
          .then(favorite => {
            response.status(204).send();
          });
      } else {
        return response.status(404).json({ error: "Song not found" });
      }
    });
});

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
