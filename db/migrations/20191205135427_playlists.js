
exports.up = function(knex) {
  return Promise.all([
    knex.schema.createTable('playlists', function(table) {
      table.increments('id').primary();
      table.string('title');

      table.timestamps(true, true);
    })
  ])
};

exports.down = function(knex) {
  return Promise.all([
    knex.schema.dropTable('playlists')
  ])
};
