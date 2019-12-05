var express = require('express');
var router = express.Router();

var formatHelper = require("../../../helpers/formatHelper");
var apiHelper = require("../../../helpers/apiHelper");

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

// const createPlaylist = router.post("/", (request, response) => {
//   console.log(request.body)
//   const title = request.body.title;
//
//   for (let requiredParameter of ["playlistTitle"]) {
//     if (!request.body[requiredParameter]) {
//       return response.status(422).send({
//         error: "Please enter a valid title"
//       });
//     }
//   }
//
//   (playlist => {
//     if (playlist.error){
//     response.status(400).send(playlist)
//   } else {
//     database("playlists").where({title: playlist.title})
//       .then(existingFavorite => {
//         if (existingFavorite[0]) {
//           response.status(400).json({message: `You already have a playlist called ${playlist.title}!`})
//         } else {
//           database("playlists").insert({title: playlist.title})
//             .then(newPlaylist => {
//               response.status(201).json(newPlaylist)[0]
//             })
//           }
//         })
//         .catch(error => {response.status(500).json ({ error });
//       })
//     }
//   })
// })

const getAllPlaylists = router.get('/', (request, response) => {
  database('playlists').select('id', 'title', 'created_at as createdAt', 'updated_at as updatedAt')
    .then((playlists) => {
      response.status(200).send(playlists);
    })
    .catch((error) => {
      response.status(500).json({ error });
    });
});

module.exports = {
  deletePlaylist,
  //createPlaylist,
  getAllPlaylists
}
