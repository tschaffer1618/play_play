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

module.exports = {
  getAllPlaylists
}
