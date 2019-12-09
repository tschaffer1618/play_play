var express = require('express');
var router = express.Router();

var formatHelper = require("../../../helpers/formatHelper");
var apiHelper = require("../../../helpers/apiHelper");

const environment = process.env.NODE_ENV || 'development';
const configuration = require('../../../knexfile')[environment];
const database = require('knex')(configuration);

const createPlaylistSong = router.post("/:id/favorites/:favoriteId", (request, response) => {
  const songId = request.params.favoriteId;
  const playlistId = request.params.id;

  database("favorite_songs").where({id: songId})
    .then(song => {
      if (song[0]) {
        database("playlists").where({id: playlistId})
          .then(playlist => {
            if (playlist[0]) {
              database("playlist_songs").where({song_id: songId, playlist_id: playlistId})
                .then(existingPlaylistSong => {
                  if (existingPlaylistSong[0]) {
                    response.status(400).json({ message: `${song[0].title} is already in ${playlist[0].title}!`})
                  } else {
                    database("playlist_songs").insert({song_id: songId, playlist_id: playlistId})
                    .then(newPlaylistSong => {
                      response.status(201).send({success: `${song[0].title} has been added to ${playlist[0].title}!`})
                    })
                  }
                })
                .catch(error => {response.status(500).json({ error });
              });
            } else {
              response.status(404).json({error: "No playlist found matching that ID. Try again!"})
            }
        })
      } else {
        response.status(404).json({error: "No song found matching that ID. Try again!"})
      }
    })
})

module.exports = {
  createPlaylistSong
}