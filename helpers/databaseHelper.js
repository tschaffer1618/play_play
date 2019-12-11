const environment = process.env.NODE_ENV || 'development';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);

async function getPlaylistFavorites(playlistId) {
  var favorites = await database('playlist_songs')
    .innerJoin('favorite_songs', 'playlist_songs.song_id', 'favorite_songs.id')
    .where('playlist_songs.playlist_id', playlistId)
    .select("favorite_songs.id", "favorite_songs.title", "favorite_songs.artist_name as artistName", "favorite_songs.genre", "favorite_songs.rating");
  if (favorites[0]) {
    return favorites
  } else {
    return []
  }
}

module.exports = {
  getPlaylistFavorites
}