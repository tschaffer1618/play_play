var mathHelper = require("./mathHelper");

function formatSong(song) {
  var formattedSong = [{
    id: song[0].id,
    title: song[0].title,
    artistName: song[0].artist_name,
    genre: song[0].genre,
    rating: song[0].rating
  }];
  return formattedSong;
}

function formatPlaylist(playlist, favorites) {
  if (favorites.length > 0) {
    var formattedPlaylist = {
      id: playlist[0].id,
      title: playlist[0].title,
      songCount: favorites.length,
      songAvgRating: mathHelper.calculateAvgRating(favorites),
      favorites: favorites,
      createdAt: playlist[0].createdAt,
      updatedAt: playlist[0].updatedAt
    }
  } else {
    var formattedPlaylist = {
      id: playlist[0].id,
      title: playlist[0].title,
      songCount: 0,
      songAvgRating: 0,
      favorites: favorites,
      createdAt: playlist[0].createdAt,
      updatedAt: playlist[0].updatedAt
    }
  }
  return formattedPlaylist;
}

module.exports = {
  formatSong,
  formatPlaylist
}
