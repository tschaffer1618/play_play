
exports.up = function(knex) {
  return Promise.all([
    knex.schema.createTable('playlist_songs', function(table) {
      table.increments('id').primary();
      table.integer('playlist_id').unsigned().references('playlists.id');
      table.integer('song_id').unsigned().references('favorite_songs.id');

      table.timestamps(true, true);
    })
  ])
};

exports.down = function(knex) {
  return Promise.all([
    knex.schema.dropTable('playlist_songs')
  ])
};

