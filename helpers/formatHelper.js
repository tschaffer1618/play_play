function formatSong(song) {
  var formattedSong = {
    id: song[0].id,
    title: song[0].title,
    artistName: song[0].artist_name,
    genre: song[0].genre,
    rating: song[0].rating
  };
  return formattedSong;
}

module.exports = {
  formatSong
}