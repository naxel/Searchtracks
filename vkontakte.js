/**
 *
 * User: Alexander Khaylo aka naxel
 * Date: 16.02.14 21:27
 */

var request = require('request');

var accessToken = null;
var id = null;
var secret = null;

function Vkontakte (params) {
    id = params.id;
    secret = params.secret;
}

Vkontakte.prototype.isValidToken = function (callback) {
    if (!accessToken) {
        this.tokenRequest(callback);
    } else {
        callback(null);
    }
};

Vkontakte.prototype.tokenRequest = function (callback) {
    var options = {
        method: 'POST',
        body: 'grant_type=client_credentials',
        uri: 'https://oauth.vk.com/',
        headers: {
            'Accept': '*/*',
            'Cache-Control': 'no-cache',
            'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
        }
    };

    options.uri = 'https://oauth.vk.com/access_token?client_id=' + id + '&client_secret='
        + secret + '&grant_type=client_credentials';

    request(options, function (error, response, body) {

        if (!error) {
            if (response.statusCode === 200) {

                var result = JSON.parse(body);
                if (result) {
                    accessToken = result.access_token;
                    callback(null);
                } else {
                    callback('Token parsing error.');
                }

            } else {
                callback('Error in token request. Server returned status: ' + response.statusCode);
            }
        } else {
            callback(error);
        }
    });
};


Vkontakte.prototype.search = function (params, callback) {

    this.isValidToken(
        function (error) {
            if (!error) {
                var options = {
                    method: 'POST',
                    headers: {
                        'Accept': '*/*',
                        'Cache-Control': 'no-cache',
                        'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
                    }
                };

                var query = params.query || '';
                var limit = parseInt(params.limit, 10) || 20;
                var offset = parseInt(params.offset, 10) || 0;
                var token = '539d9cd7708b970f0484946d8b81ebfdd06b77ddd57a79e2b2191dd73d99e94b697bf8c93431fc6ad2411';
                options.uri = 'https://api.vk.com/method/audio.search?' +
                    'access_token=' + encodeURIComponent(token) +
                    '&auto_complete' +
                    '&offset=' + offset +
                    '&sort=2' +
                    '&count=' + limit +
                    '&q=' + encodeURIComponent(query);

                request(options, function (error, response, body) {

                    if (!error) {
                        if (response.statusCode === 200) {
                            var result = JSON.parse(body);
                            if (result) {
                                if (result.response && result.response[0]) {
                                    var count = result.response[0];
                                    var tracks = [];
                                    var track = {};
                                    result.response.shift();
                                    var length = result.response.length;
                                    for (var i = 0; i < length; i++) {
                                        track = {
                                            'id': result.response[i].aid,
                                            'artist': result.response[i].artist,
                                            'track': result.response[i].title,
                                            'length': result.response[i].duration,
                                            'url': result.response[i].url,
                                            'owner_id': result.response[i].owner_id,
                                            'genre': result.response[i].genre,
                                            'source': 'vkontakte'
                                        };

                                        if (result.response[i].lyrics_id) {
                                            track.lyrics_id = result.response[i].lyrics_id;
                                        }
                                        tracks.push(track);
                                    }

                                    callback(
                                        null,
                                        {
                                            "success": true,
                                            "count": count,
                                            "tracks": tracks
                                        }
                                    );
                                } else {
                                    callback('Error in response parameter: ' + result.response + '. body: ' + body);
                                }

                            } else {
                                callback('Error json-encoding body: ' + body);
                            }
                        } else {
                            callback('Error in search tracks request. Server returned status: ' + response.statusCode);
                        }
                    } else {
                        callback(error);
                    }
                });
            } else {
                callback(error);
            }
        });
};

Vkontakte.prototype.getTrackUrl = function (params, callback) {
    if (!params.url) {
        callback('Required param is empty');
        return;
    }
    callback(null, params.url);
};

module.exports = Vkontakte;
