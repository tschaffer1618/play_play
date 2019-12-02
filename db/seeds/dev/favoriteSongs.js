exports.seed = function(knex, Promise) {
  return knex('favorite_songs').del()
    .then(() => {
      return Promise.all([

        knex('favorite_songs').insert({
          title: 'Milkshake', artist: 'Kelis', genre: 'Pop', rating: 3
        }, 'id')
        .then(() => console.log('Seeding complete!'))
        .catch(error => console.log(`Error seeding data: ${error}`))
      ])
    })
    .catch(error => console.log(`Error seeding data: ${error}`));
};
