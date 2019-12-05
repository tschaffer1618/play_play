const dontStopMeNow = {
    "message": {
        "header": {
            "status_code": 200,
            "execute_time": 0.013079881668091,
            "confidence": 1000,
            "mode": "search",
            "cached": 1
        },
        "body": {
            "track": {
                "track_id": 30109794,
                "track_name": "Don't Stop Me Now",
                "track_name_translation_list": [
                    {
                        "track_name_translation": {
                            "language": "JA",
                            "translation": "ドント・ストップ・ミー・ナウ"
                        }
                    }
                ],
                "track_rating": 81,
                "commontrack_id": 10889542,
                "instrumental": 0,
                "explicit": 1,
                "has_lyrics": 1,
                "has_subtitles": 1,
                "has_richsync": 1,
                "num_favourite": 7218,
                "album_id": 13761314,
                "album_name": "Jazz",
                "artist_id": 118,
                "artist_name": "Queen",
                "track_share_url": "https://www.musixmatch.com/lyrics/Queen/Don-t-Stop-Me-Now?utm_source=application&utm_campaign=api&utm_medium=Turing+School+of+Software+and+Design%3A1409618774346",
                "track_edit_url": "https://www.musixmatch.com/lyrics/Queen/Don-t-Stop-Me-Now/edit?utm_source=application&utm_campaign=api&utm_medium=Turing+School+of+Software+and+Design%3A1409618774346",
                "restricted": 0,
                "updated_time": "2019-11-25T00:02:00Z",
                "primary_genres": {
                    "music_genre_list": [
                        {
                            "music_genre": {
                                "music_genre_id": 1133,
                                "music_genre_parent_id": 14,
                                "music_genre_name": "Pop/Rock",
                                "music_genre_name_extended": "Pop / Pop/Rock",
                                "music_genre_vanity": "Pop-Pop-Rock"
                            }
                        },
                        {
                            "music_genre": {
                                "music_genre_id": 1146,
                                "music_genre_parent_id": 21,
                                "music_genre_name": "Arena Rock",
                                "music_genre_name_extended": "Rock / Arena Rock",
                                "music_genre_vanity": "Rock-Arena-Rock"
                            }
                        },
                        {
                            "music_genre": {
                                "music_genre_id": 1152,
                                "music_genre_parent_id": 21,
                                "music_genre_name": "Hard Rock",
                                "music_genre_name_extended": "Rock / Hard Rock",
                                "music_genre_vanity": "Rock-Hard-Rock"
                            }
                        },
                        {
                            "music_genre": {
                                "music_genre_id": 21,
                                "music_genre_parent_id": 34,
                                "music_genre_name": "Rock",
                                "music_genre_name_extended": "Rock",
                                "music_genre_vanity": "Rock"
                            }
                        }
                    ]
                }
            }
        }
    }
}

const underPressure = {
    "message": {
        "header": {
            "status_code": 200,
            "execute_time": 0.051326990127563,
            "confidence": 848,
            "mode": "search",
            "cached": 0
        },
        "body": {
            "track": {
                "track_id": 31597388,
                "track_name": "Ice Ice Baby Under Pressure (two tracker)",
                "track_name_translation_list": [],
                "track_rating": 1,
                "commontrack_id": 12352319,
                "instrumental": 0,
                "explicit": 0,
                "has_lyrics": 0,
                "has_subtitles": 0,
                "has_richsync": 0,
                "num_favourite": 0,
                "album_id": 11314511,
                "album_name": "The Best of DMC: Bootlegs, Cut-Ups and Two Trackers, Volume 6",
                "artist_id": 24408176,
                "artist_name": "Vanilla Ice vs. Queen & Bowie",
                "track_share_url": "https://www.musixmatch.com/lyrics/Vanilla-Ice-vs-Queen-Bowie/Ice-Ice-Baby-Under-Pressure-two-tracker?utm_source=application&utm_campaign=api&utm_medium=Turing+School+of+Software+and+Design%3A1409618774346",
                "track_edit_url": "https://www.musixmatch.com/lyrics/Vanilla-Ice-vs-Queen-Bowie/Ice-Ice-Baby-Under-Pressure-two-tracker/edit?utm_source=application&utm_campaign=api&utm_medium=Turing+School+of+Software+and+Design%3A1409618774346",
                "restricted": 0,
                "updated_time": "2013-07-18T02:39:48Z",
                "primary_genres": {
                    "music_genre_list": []
                }
            }
        }
    }
}

const apiSong = async function (title, artist) {
  if (title === "Don't Stop Me Now") {
    return {
      "title": dontStopMeNow.message.body.track.track_name,
      "artistName": dontStopMeNow.message.body.track.artist_name,
      "genre": dontStopMeNow.message.body.track.primary_genres.music_genre_list[0].music_genre.music_genre_name,
      "rating": dontStopMeNow.message.body.track.track_rating
    };
  } else if (title === "Under Pressure") {
    return {
      "title": underPressure.message.body.track.track_name,
      "artistName": underPressure.message.body.track.artist_name,
      "genre": "Unknown",
      "rating": underPressure.message.body.track.track_rating
    };
  } else {
    return {
      error: "No songs found matching that title and artist. Try again!"
    };
  }
}

module.exports = {
  apiSong
}