/**
 *
 * User: Alexander Khaylo aka naxel
 * Date: 04.02.14 22:44
 */

var request = require('request');

var accessToken = null;
var tokenExpireTime = null;

function Prostopleer () {}

Prostopleer.prototype.isValidToken = function (callback) {
    if (!tokenExpireTime || tokenExpireTime < (new Date()).getTime()) {
        this.tokenRequest(callback);
    } else {
        callback(null);
    }
};

Prostopleer.prototype.tokenRequest = function (callback) {
    // auth is: 'Basic VGVzdDoxMjM='
    //'Basic ' + new Buffer(username + ':' + password).toString('base64');

    var options = {
        method: 'POST',
        body: 'grant_type=client_credentials',
        uri: 'http://api.pleer.com/token.php',
        headers: {
            'Accept': '*/*',
            'Cache-Control': 'no-cache',
            'Authorization': 'Basic Og==',
            'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
        }
    };
    request(options, function (error, response, body) {

        if (!error) {
            if (response.statusCode === 200) {

                var result = JSON.parse(body);
                if (result) {
                    accessToken = result.access_token;
                    tokenExpireTime = (new Date()).getTime() + 3600000;
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


Prostopleer.prototype.search = function (params, callback) {

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
                options.uri = 'http://api.pleer.com/index.php';

                var query = params.query || '';
                var limit = parseInt(params.limit, 10) || 20;
                var quality = params.quality || 'all';//all, bad, good, best
                var page = parseInt(params.page, 10) || 1;
                if (query && query.length > 0) {

                    options.body = 'access_token=' + encodeURIComponent(accessToken) +
                        '&method=tracks_search' +
                        '&result_on_page=' + limit +
                        '&quality=' + encodeURIComponent(quality) +
                        '&page=' + page +
                        '&query=' + encodeURIComponent(query);

                    request(options, function (error, response, body) {

                        if (!error) {
                            if (response.statusCode === 200) {
                                var result = JSON.parse(body);

                                var tracks = [];
                                var track;

                                for (var i in result.tracks) {
                                    track = {
                                        'id': result.tracks[i].id,
                                        'artist': result.tracks[i].artist,
                                        'track': result.tracks[i].track,
                                        'length': result.tracks[i].lenght,
                                        'text_id': result.tracks[i].text_id,
                                        'bitrate': result.tracks[i].bitrate,
                                        'source': 'prostopleer'
                                    };

                                    tracks.push(track);
                                }
                                callback(
                                    null,
                                    {
                                        "success": true,
                                        "count": result.count,
                                        "tracks": tracks
                                    }
                                );

                            } else {
                                callback('Error in search tracks request. Server returned status: ' + response.statusCode);
                            }
                        } else {
                            callback(error);
                        }
                    });
                } else {
                    /**
                     list_type (int, обязательный) тип списка, 1- неделя, 2 - месяц, 3 - 3 месяца, 4 - полгода, 5 - год
                     */
                    var listType = parseInt(params.list_type, 10) || 1;
                    /**
                     * language (string) — тип топа en - иностранный, ru - русский.
                     */
                    var language = params.language || 'en';
                    var method = 'get_top_list';
                    options.body = 'access_token=' + encodeURIComponent(accessToken) +
                        '&method=get_top_list' +
                        '&list_type=' + listType +
                        '&language=' + encodeURIComponent(language) +
                        '&page=' + page;

                    request(options, function (error, response, body) {

                        if (!error) {
                            if (response.statusCode === 200) {
                                var result = JSON.parse(body);

                                var tracks = [];
                                var track;
                                for (var i in result.tracks.data) {
                                    track = {
                                        'id': result.tracks.data[i].id,
                                        'artist': result.tracks.data[i].artist,
                                        'track': result.tracks.data[i].track,
                                        'length': result.tracks.data[i].lenght,
                                        'text_id': result.tracks.data[i].text_id,
                                        'bitrate': result.tracks.data[i].bitrate,
                                        'source': 'prostopleer'
                                    };

                                    tracks.push(track);
                                }
                                callback(
                                    null,
                                    {
                                        "success": true,
                                        "count": result.tracks.count,
                                        "tracks": tracks
                                    }
                                );

                            } else {
                                callback('Error in search tracks request. Server returned status: ' + response.statusCode);
                            }
                        } else {
                            callback(error);
                        }
                    });
                }


            } else {
                callback(error);
            }
        });
};


Prostopleer.prototype.getTrackUrl = function (params, callback) {
    if (!params.track_id) {
        callback('Required param is empty');
        return;
    }
    var trackId = params.track_id;
    var reason = params.reason || 'listen';
    var options = {
        method: 'POST',
        headers: {
            'Accept': '*/*',
            'Cache-Control': 'no-cache',
            'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
        }
    };
    options.uri = 'http://api.pleer.com/index.php';
    options.body = 'access_token=' + encodeURIComponent(accessToken) +
        '&method=tracks_get_download_link' +
        '&reason=' + encodeURIComponent(reason) +
        '&track_id=' + encodeURIComponent(trackId);

    request(options, function (error, response, body) {

        if (!error && response.statusCode === 200) {

            var result = JSON.parse(body);
            if (result) {
                if (result.success === true && result.url) {
                    callback(null, result.url);
                } else {
                    callback('Response error.');
                }
            } else {
                callback('Response parsing error.');
            }

        } else {
            callback(error);
        }
    });
};

module.exports = Prostopleer;
