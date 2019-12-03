var express = require('express');
var router = express.Router();

const environment = process.env.NODE_ENV || 'development';
const configuration = require('../../../knexfile')[environment];
const database = require('knex')(configuration);


router.get('/', (request, response) => {
  database('favorite_songs').select()
    .then((favoriteSongs) => {
      response.status(200).json(favoriteSongs);
    })
    .catch((error) => {
      response.status(500).json({ error });
    });
});

router.delete("/:id", (request, response) => {
  const favorite = request.body;
  const songId = favorite.id;
  const songName = favorite.track_name;

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

module.exports = router;
