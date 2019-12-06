var express = require('express');
var router = express.Router();

var formatHelper = require("../../../helpers/formatHelper");
var apiHelper = require("../../../helpers/apiHelper");

const environment = process.env.NODE_ENV || 'development';
const configuration = require('../../../knexfile')[environment];
const database = require('knex')(configuration);

const getAllPlaylists = router.get('/', (request, response) => {
  database('playlists').select('id', 'title', 'created_at as createdAt', 'updated_at as updatedAt')
    .then((playlists) => {
      response.status(200).send(playlists);
    })
    .catch((error) => {
      response.status(500).json({ error });
    });
});

const editPlaylist = router.put('/:id', (request, response) => {
  const playlistId = request.params.id;
  const newTitle = request.body.title;
  database('playlists').where({title: `${newTitle}`})
    .then((duplicatePlaylist) => {
      if (duplicatePlaylist[0]) {
        response.status(400).send({error: `You already have a playlist called ${newTitle}.`})
      } else {
        database('playlists').where({id: `${playlistId}`})
          .then((playlist) => {
            if (playlist[0]) {
              database('playlists').where({id: `${playlistId}`}).update({title: `${newTitle}`})
                .then((updatedPlaylist) => {
                  database('playlists').where({id: `${playlistId}`}).select('id', 'title', 'created_at as createdAt', 'updated_at as updatedAt')
                    .then((playlistToSend) => {
                      response.status(200).json(playlistToSend[0])
                    })
                })
            } else {
              response.status(404).send({error: 'No playlist found matching that id. Try again!'})
            }
          })
      }
    })
})

module.exports = {
  getAllPlaylists
}
