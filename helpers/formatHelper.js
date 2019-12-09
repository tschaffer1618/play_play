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
  return {
    id: playlist[0].id,
    title: playlist[0].title,
    favorites: favorites,
    createdAt: playlist[0].createdAt,
    updatedAt: playlist[0].updatedAt
  }
}

module.exports = {
  formatSong,
  formatPlaylist
}
