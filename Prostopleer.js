/**
 *
 * User: Alexander Khaylo aka naxel
 * Date: 04.02.14 22:44
 */

var request = require('request');
function Strategy() {
    this.search = function() {};
}

var accessToken = null;
var tokenExpireTime = null;

function Prostopleer() {}

Prostopleer.prototype = new Strategy();
Prostopleer.prototype.constructor = Prostopleer;

Prostopleer.prototype.isValidToken = function(callback) {
    if (!tokenExpireTime || tokenExpireTime < (new Date()).getTime()) {
        this.tokenRequest(callback);
    } else {
        callback();
    }
};

Prostopleer.prototype.tokenRequest = function(callback) {
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
            'Content-Type': 'application/x-www-form-urlencoded; charset=windows-1251'
        }
    };
    request(options, function(error, response, body) {

        if (!error && response.statusCode === 200) {

            accessToken = JSON.parse(body).access_token;
            tokenExpireTime = (new Date()).getTime() + 3600000;
            if (callback) {
                callback();
            }

        } else {
            console.error(error);
        }
    });
};


Prostopleer.prototype.search = function(params, callback) {

    this.isValidToken(
        function() {
            var options = {
                method: 'POST',
                headers: {
                    'Accept': '*/*',
                    'Cache-Control': 'no-cache',
                    'Content-Type': 'application/x-www-form-urlencoded; charset=windows-1251'
                }
            };
            options.uri = 'http://api.pleer.com/index.php';

            var query = params.query || '';
            var limit = params.limit || 20;
            if (query && query.length > 1) {

                options.body = 'access_token=' + accessToken +
                    '&method=tracks_search' +
                    '&result_on_page=' + limit +
                    '&query=' + query;
            } else {
                /**
                 list_type (int, обязательный) тип списка, 1- неделя, 2 - месяц, 3 - 3 месяца, 4 - полгода, 5 - год
                 */
                var listType = params.list_type || 1;
                /**
                 * language (string) — тип топа en - иностранный, ru - русский.
                 */
                var language = params.language || 'en';
                /**
                 * page (int) — текущая страница.
                 */
                var page = params.page || 1;
                var method = 'get_top_list';
                options.body = 'access_token=' + accessToken +
                    '&method=get_top_list' +
                    '&list_type=' + listType +
                    '&language=' + language +
                    '&page=' + page;
            }

            request(options, function(error, response, body) {

                if (!error && response.statusCode === 200) {
                    if (callback) {
                        callback(body);
                    }
                } else {
                    console.error(error);
                }
            });
        });
};


Prostopleer.prototype.getTrackUrl = function(params, callback) {
    if (!params.track_id) {
        throw Error('Required param is empty');
    }
    var trackId = params.track_id;
    var reason = params.reason || 'listen';
    var options = {
        method: 'POST',
        headers: {
            'Accept': '*/*',
            'Cache-Control': 'no-cache',
            'Content-Type': 'application/x-www-form-urlencoded; charset=windows-1251'
        }
    };
    options.uri = 'http://api.pleer.com/index.php';
    options.body = 'access_token=' + accessToken +
        '&method=tracks_get_download_link' +
        '&reason=' + reason +
        '&track_id=' + trackId;

    request(options, function(error, response, body) {

        if (!error && response.statusCode === 200) {

            if (callback) {
                var result = JSON.parse(body);
                if (result.success === true && result.url) {
                    callback(result.url);
                } else {
                    callback(null);
                }
            }

        } else {
            console.error(error);
        }
    });
};

module.exports = Prostopleer;
