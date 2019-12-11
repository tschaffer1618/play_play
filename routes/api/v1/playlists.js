var express = require("express");
var router = express.Router();

var formatHelper = require("../../../helpers/formatHelper");
var apiHelper = require("../../../helpers/apiHelper");
var databaseHelper = require("../../../helpers/databaseHelper");

const environment = process.env.NODE_ENV || "development";
const configuration = require("../../../knexfile")[environment];
const database = require("knex")(configuration);

const createPlaylist = router.post("/", async (request, response) => {
  const title = request.body.playlistTitle;
  for (let requiredParameter of ["playlistTitle"]) {
    if (!request.body[requiredParameter]) {
      return response.status(422).send({error: "Please enter a valid title"});
    };
  };
  const duplicatePlaylist = await database("playlists").where({title: title});
  if (duplicatePlaylist[0]) {
    response.status(400).json({ message: `You already have a playlist called ${title}!`});
  } else {
    const newPlaylist = await database("playlists").insert({title: title})
      .returning(["id", "title", "created_at as createdAt", "updated_at as updatedAt"]);
    response.status(201).json(newPlaylist);
  };
});

const getPlaylist = router.get("/:id/favorites", async (request, response) => {
  const playlistId = request.params.id;
  const favorites = await databaseHelper.getPlaylistFavorites(playlistId);
  const existingPlaylist =  await database("playlists").where({id: playlistId})
    .select("id", "title", "created_at as createdAt", "updated_at as updatedAt");
  if (existingPlaylist[0] && favorites[0]) {
    const playlist = await database("playlists")
      .innerJoin("playlist_songs", "playlists.id", "playlist_songs.playlist_id")
      .where("playlists.id", playlistId)
      .select("playlists.id", "title", "playlists.created_at as createdAt", "playlists.updated_at as updatedAt");
    response.status(200).send(formatHelper.formatPlaylist(playlist, favorites));
  } else if (existingPlaylist[0]) {
    response.status(200).send(formatHelper.formatPlaylist(existingPlaylist, favorites));
  } else {
    response.status(404).json({error: "No playlist found matching that ID. Try again!"});
  };
});

const getAllPlaylists = router.get("/", async (request, response) => {
  const playlists = await database("playlists")
    .select("id", "title", "created_at as createdAt", "updated_at as updatedAt");
  const final = await formatHelper.getAllFavorites(playlists);
  response.status(200).send(final);
});

const editPlaylist = router.put("/:id", async (request, response) => {
  const playlistId = request.params.id;
  const newTitle = request.body.playlistTitle;
  const duplicatePlaylist = await database("playlists").where({title: `${newTitle}`});
  if (duplicatePlaylist[0]) {
    response.status(400).send({message: `You already have a playlist called ${newTitle}!`});
  } else {
    const playlist = await database("playlists").where({id: `${playlistId}`});
    if (playlist[0]) {
      const updatedPlaylist = await database("playlists").where({id: `${playlistId}`})
        .update({title: `${newTitle}`})
        .returning(["id", "title", "created_at as createdAt", "updated_at as updatedAt"]);
      response.status(200).json(updatedPlaylist[0]);
    } else {
      response.status(404).send({error: "No playlist found matching that id. Try again!"});
    };
  };
});

const deletePlaylist = router.delete("/:id", async (request, response) => {
  const playlistId = request.params.id;
  const playlist = await database("playlists").where({id: playlistId});
  if (playlist[0]) {
    await database("playlists").del().where({id: playlistId});
    response.status(204).send();
  } else {
    response.status(404).json({ error: "Playlist not found" });
  };
});

module.exports = {
  createPlaylist,
  getPlaylist,
  getAllPlaylists,
  editPlaylist,
  deletePlaylist
}
