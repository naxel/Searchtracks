/**
 *
 * User: Alexander Khaylo aka naxel
 * Date: 04.02.14 22:43
 */
function SearchTracks(strategy) {

    this.search = function(params, callback) {
        if (!params) {
            throw Error('Required param is empty');
        }
        if (!callback) {
            throw Error('Callback is empty');
        }
        strategy.search(params, callback);
    };

    this.listMyTracks = function(params, callback) {
        if (!params) {
            throw Error('Required param is empty');
        }
        if (!callback) {
            throw Error('Callback is empty');
        }
        strategy.listMyTracks(params, callback);
    };

    this.getTrackUrl = function(params, callback) {
        if (!params) {
            throw Error('Required param is empty');
        }
        if (!callback) {
            throw Error('Callback is empty');
        }
        strategy.getTrackUrl(params, callback);
    };

}
module.exports = SearchTracks;
