var express = require('express');
var router = express.Router();

var formatHelper = require("../../../helpers/formatHelper");
var apiHelper = require("../../../helpers/apiHelper");
var databaseHelper = require("../../../helpers/databaseHelper");

const environment = process.env.NODE_ENV || 'development';
const configuration = require('../../../knexfile')[environment];
const database = require('knex')(configuration);


const deletePlaylist = router.delete("/:id", (request, response) => {
  const playlistId = request.params.id;

  database("playlists").where("id", playlistId)
    .then(playlist => {
      if (playlist[0]) {
        database("playlists").del().where({ id: playlistId })
          .then(playlist => {
            response.status(204).send();
          });
      } else {
        return response.status(404).json({ error: "Playlist not found" });
      }
    });
});

const createPlaylist = router.post("/", (request, response) => {
  const title = request.body.playlistTitle;

  for (let requiredParameter of ["playlistTitle"]) {
    if (!request.body[requiredParameter]) {
      return response.status(422).send({
        error: "Please enter a valid title"
      });
    }
  }

  database("playlists").where({title: title})
    .then(existingPlaylist => {
      if (existingPlaylist[0]) {
        response.status(400).json({ message: `You already have a playlist called ${title}!`})
      } else {
        database("playlists").insert({title: title})
        .returning(['id', 'title', 'created_at as createdAt', 'updated_at as updatedAt'])
        .then(newPlaylist => {
          response.status(201).json(newPlaylist)
        })
      }
    })
    .catch(error => {response.status(500).json({ error });
  });
})

const getPlaylist = router.get('/:id/favorites', async (request, response) => {
  const playlistId = request.params.id
  const favorites = await databaseHelper.getPlaylistFavorites(playlistId);
  database('playlists').where({id: playlistId}).select('id', 'title', 'created_at as createdAt', 'updated_at as updatedAt')
    .then(existingPlaylist => {
      if (existingPlaylist[0] && favorites[0]) {
        database('playlists').innerJoin('playlist_songs', 'playlists.id', 'playlist_songs.playlist_id').where("playlists.id", playlistId ).select('playlists.id', 'title', 'playlists.created_at as createdAt', 'playlists.updated_at as updatedAt')
          .then((playlist) => {
            response.status(200).send(formatHelper.formatPlaylist(playlist, favorites));
          })
          .catch((error) => {
            response.status(500).json({ error });
          });
      } else if (existingPlaylist[0]) {
        response.status(200).send(formatHelper.formatPlaylist(existingPlaylist, favorites));
      } else {
        response.status(404).json({error: "No playlist found matching that ID. Try again!"})
      }
    })
});

const getAllPlaylists = router.get('/', async (request, response) => {
  const playlists = await database('playlists').select('id', 'title', 'created_at as createdAt', 'updated_at as updatedAt')
  const final = await formatHelper.getAllFavorites(playlists);
  response.status(200).send(final);
});

const editPlaylist = router.put('/:id', (request, response) => {
  const playlistId = request.params.id;
  const newTitle = request.body.playlistTitle;
  database('playlists').where({title: `${newTitle}`})
    .then((duplicatePlaylist) => {
      if (duplicatePlaylist[0]) {
        response.status(400).send({message: `You already have a playlist called ${newTitle}!`})
      } else {
        database('playlists').where({id: `${playlistId}`})
          .then((playlist) => {
            if (playlist[0]) {
              database('playlists').where({id: `${playlistId}`}).update({title: `${newTitle}`}).returning(['id', 'title', 'created_at as createdAt', 'updated_at as updatedAt'])
                .then((updatedPlaylist) => {
                  response.status(200).json(updatedPlaylist[0])
                })
            } else {
              response.status(404).send({error: 'No playlist found matching that id. Try again!'})
            }
          })
      }
    })
})

module.exports = {
  deletePlaylist,
  getAllPlaylists,
  editPlaylist,
  createPlaylist,
  getPlaylist
}
