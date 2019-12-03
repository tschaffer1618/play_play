var express = require('express');
var router = express.Router();

const environment = process.env.NODE_ENV || 'development';
const configuration = require('../../../knexfile')[environment];
const database = require('knex')(configuration);

const getFavoriteSong = router.get('/:id', (request, response) => {
  const favoriteId = request.params.id
  database('favorite_songs').where('id', favoriteId)
    .then((favoriteSong) => {
      if (favoriteSong[0]) {
        response.status(200).json(favoriteSong);
      } else {
        response.status(404).json({ error: 'Song not found'});
      }
    })
    .catch((error) => {
      response.status(500).json({ error });
    });
});

module.exports = {
  getFavoriteSong
};
