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
  const songName = favorite.title;

  database("favorite_songs").where("id", songId)
    .then(favorite => {
      if (favorite[0]) {
        database("favorite_songs").del().where({ id: songId })
          .then(favorite => {
            response.status(204).json({ message: `Song with id ${songId} has been removed from your favorites`});
          });
      } else {
        return response.status(404).json({ error: `No song found in favorites with id ${songId}.` });
      }
    });
});

module.exports = router;
