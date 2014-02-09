/**
 *
 * User: Alexander
 * Date: 08.02.14 16:09
 */
var should = require('should');
var SearchTracks = require('../index'),
    Prostopleer = require('../prostopleer');


var searchTracks = new SearchTracks(new Prostopleer());

describe('#searchTracks (Prostopleer)', function() {
    var params = {
        query: 'slot',
        limit: 1
    };
    it('searchTracks.search()', function(done) {
        searchTracks.search(params, function(error, response) {

            should.not.exist(error);
            response.should.match(/^\{"success":true,"count":"\d*","tracks":\{/);
            var result = JSON.parse(response);
            result.should.have.property('success');
            result.should.have.property('count');
            result.should.have.property('tracks');
            result.success.should.be.eql(true);
            result.count.should.be.above(0);

            for (var track in result.tracks) {
                result.tracks[track].should.have.property('id');
                result.tracks[track].should.have.property('artist');
                result.tracks[track].should.have.property('track');
                result.tracks[track].should.have.property('lenght');
                done();
                break;
            }
        });
    });

    it('searchTracks.getTrackUrl()', function(done) {

        searchTracks.search(params, function(error, response) {

            var result = JSON.parse(response);

            for (var track in result.tracks) {

                var params = {
                    track_id: result.tracks[track].id
                };
                searchTracks.getTrackUrl(params, function(error, url) {

                    should.not.exist(error);
                    url.should.match(/^http/);
                    done();
                });
                break;
            }
        });
    });
});
