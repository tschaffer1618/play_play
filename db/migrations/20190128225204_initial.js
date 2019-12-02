
exports.up = function(knex) {
  return Promise.all([
    knex.schema.createTable('favorite_songs', function(table) {
      table.increments('id').primary();
      table.string('title');
      table.string('artist_name');
      table.string('genre');
      table.integer('rating');

      table.timestamps(true, true);
    })
  ])
};


exports.down = function(knex) {
  return Promise.all([
    knex.schema.dropTable('favorite_songs')
  ]);
}
