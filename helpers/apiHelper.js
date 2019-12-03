const fetch = require("node-fetch");

async function apiSong(title, artist) {
  let response = await fetch(
    `https://api.musixmatch.com/ws/1.1/matcher.track.get?apikey=${process.env.MUSIX_API_KEY}&q_track=${title}&q_artist=${artist}`
  );
  let json_response = await response.json();
  return {
    "title": json_response.message.body.track.track_name,
    "artistName": json_response.message.body.track.artist_name,
    "genre": json_response.message.body.track.primary_genres.music_genre_list[0].music_genre.music_genre_name,
    "rating": json_response.message.body.track.track_rating
  };
}

module.exports = {
  apiSong
}
