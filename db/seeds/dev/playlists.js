exports.seed = function(knex) {
  return knex('playlists').del()
    .then(() => {
      return Promise.all([

        knex('playlists').insert({
          title: 'Chill'
        }, 'id')
        .then(() => console.log('Seeding complete!'))
        .catch(error => console.log(`Error seeding data: ${error}`))
      ])
    })
    .catch(error => console.log(`Error seeding data: ${error}`));
};
