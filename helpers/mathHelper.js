function calculateAvgRating(favorites) {
  var sum = 0;
  var total = favorites.length
  for( var i = 0; i < total; i++ ){
    sum += favorites[i].rating;
  }
  var avg = sum/total;
  return avg
}

module.exports = {
  calculateAvgRating
}