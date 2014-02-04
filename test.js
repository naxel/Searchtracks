/**
 *
 * User: Alexander Khaylo aka naxel
 * Date: 04.02.14 22:48
 */
var Prostopleer = require('./prostopleer');
var SearchTracks = require('./index');

var searchTracks = new SearchTracks(new Prostopleer());


var params = {
    query: 'slot',
    limit: 20
};
searchTracks.search(params, function(result) {
    console.log(result);
});
