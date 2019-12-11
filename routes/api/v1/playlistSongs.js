var express = require("express");
var router = express.Router();

var formatHelper = require("../../../helpers/formatHelper");
var apiHelper = require("../../../helpers/apiHelper");

const environment = process.env.NODE_ENV || "development";
const configuration = require("../../../knexfile")[environment];
const database = require("knex")(configuration);

const createPlaylistSong = router.post("/:id/favorites/:favoriteId", async (request, response) => {
  const songId = request.params.favoriteId;
  const playlistId = request.params.id;
  const song = await database("favorite_songs").where({id: songId});
  if (song[0]) {
    const playlist = await database("playlists").where({id: playlistId});
    if (playlist[0]) {
      const existingPlaylistSong = await database("playlist_songs").where({song_id: songId, playlist_id: playlistId});
      if (existingPlaylistSong[0]) {
        response.status(400).json({ message: `${song[0].title} is already in ${playlist[0].title}!`});
      } else {
        await database("playlist_songs").insert({song_id: songId, playlist_id: playlistId});
        response.status(201).json({success: `${song[0].title} has been added to ${playlist[0].title}!`});
      };
    } else {
      response.status(404).json({error: "No playlist found matching that ID. Try again!"});
    };
  } else {
    response.status(404).json({error: "No song found matching that ID. Try again!"});
  };
});

const deletePlaylistSong = router.delete("/:id/favorites/:favoriteId", async (request, response) => {
  const playlistId = request.params.id;
  const songId = request.params.favoriteId;
  const favorite = await database("playlist_songs").where("song_id", songId);
  if (favorite[0]) {
    const playlist = await database("playlists").where({id: playlistId});
    if (playlist[0]) {
      const existingPlaylistSong = await database("playlist_songs").where({ song_id: songId, playlist_id: playlistId });
      if (existingPlaylistSong[0]) {
        await database("playlist_songs").del().where({song_id: songId, playlist_id: playlistId});
        response.status(204).send();
      } else {
        response.status(404).json({ error: "That song isn't in that playlist. Try again!"});
      };
    } else {
      response.status(404).json({ error: "No playlist found matching that ID. Try again!"});
    };
  } else {
    return response.status(404).json({ error: "No song found matching that ID. Try again!"});
  };
});

module.exports = {
  createPlaylistSong,
  deletePlaylistSong
}
