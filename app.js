const dotenv = require('dotenv').config();
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];

var indexRouter = require('./routes/index');
var favoriteSongsRouter = require('./routes/api/v1/favoriteSongs');
var playlistsRouter = require('./routes/api/v1/playlists');
var playlistSongsRouter = require('./routes/api/v1/playlistSongs');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api/v1/favorites', favoriteSongsRouter.getFavoriteSong);
app.use('/api/v1/favorites', favoriteSongsRouter.getAllFavoriteSongs);
app.use('/api/v1/favorites', favoriteSongsRouter.deleteFavoriteSong);
app.use('/api/v1/favorites', favoriteSongsRouter.createFavoriteSong);

app.use('/api/v1/playlists', playlistsRouter.getAllPlaylists);
app.use('/api/v1/playlists', playlistsRouter.editPlaylist);
app.use('/api/v1/playlists', playlistsRouter.deletePlaylist);
app.use('/api/v1/playlists', playlistsRouter.createPlaylist);

app.use('/api/v1/playlists', playlistSongsRouter.createPlaylistSong);

module.exports = app;
