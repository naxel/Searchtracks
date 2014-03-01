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
        query: '',
        quality: 'best',
        limit: 1
    };
    it('searchTracks.search() //empty query', function(done) {
        searchTracks.search(params, function(error, response) {

            should.not.exist(error);
            response.should.have.property('success');
            response.should.have.property('count');
            response.should.have.property('tracks');
            response.success.should.be.eql(true);
            response.count.should.be.above(0);

            for (var track in response.tracks) {
                response.tracks[track].should.have.property('id');
                response.tracks[track].should.have.property('artist');
                response.tracks[track].should.have.property('track');
                response.tracks[track].should.have.property('length');
                done();
                break;
            }
        });
    });

    it('searchTracks.getTrackUrl() //empty query', function(done) {

        searchTracks.search(params, function(error, response) {

            should.not.exist(error);
            response.should.have.property('success');
            response.should.have.property('count');
            response.should.have.property('tracks');
            response.success.should.be.eql(true);
            response.count.should.be.above(0);

            for (var track in response.tracks) {

                var params = {
                    track_id: response.tracks[track].id
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

    params = {
        query: 'slot',
        quality: 'best',
        limit: 1
    };
    it('searchTracks.search()', function(done) {
        searchTracks.search(params, function(error, response) {

            should.not.exist(error);
            response.should.have.property('success');
            response.should.have.property('count');
            response.should.have.property('tracks');
            response.success.should.be.eql(true);
            response.count.should.be.above(0);

            for (var track in response.tracks) {
                response.tracks[track].should.have.property('id');
                response.tracks[track].should.have.property('artist');
                response.tracks[track].should.have.property('track');
                response.tracks[track].should.have.property('length');
                done();
                break;
            }
        });
    });

    it('searchTracks.getTrackUrl()', function(done) {

        searchTracks.search(params, function(error, response) {

            should.not.exist(error);
            response.should.have.property('success');
            response.should.have.property('count');
            response.should.have.property('tracks');
            response.success.should.be.eql(true);
            response.count.should.be.above(0);

            for (var track in response.tracks) {

                var params = {
                    track_id: response.tracks[track].id
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
