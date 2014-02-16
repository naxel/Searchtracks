/**
 *
 * User: Alexander
 * Date: 16.02.14 22:26
 */
var should = require('should');
var SearchTracks = require('../index'),
    Vkontakte = require('../vkontakte');

var config = {
    id: 3420113,
    secret: process.env.VK_SECRET
};

var searchTracks = new SearchTracks(new Vkontakte(config));

describe('#searchTracks (Vkontakte)', function() {
    var params = {
        query: 'slot',
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
                response.tracks[track].should.have.property('lenght');
                done();
                break;
            }
        });
    });
});
