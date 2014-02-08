Searchtracks
============

Search Tracks

[![Build Status](https://travis-ci.org/naxel/Searchtracks.png?branch=master)](https://travis-ci.org/naxel/Searchtracks)

Example:

```js
var Prostopleer = require('searchtracks/prostopleer');
var SearchTracks = require('searchtracks');

var searchTracks = new SearchTracks(new Prostopleer());

var params = {
    query: 'slot',
    limit: 20
};
searchTracks.search(params, function(error, response) {

    if (!error) {
        if (response) {

            var result = JSON.parse(response);

            if (result && result.success) {

                console.log('Found tracks: ' + result.count);

                for (var track in result.tracks) {
                    console.log('First track: ' + result.tracks[track].artist + ' - ' + result.tracks[track].track);

                    var params = {
                        track_id: result.tracks[track].id
                    };
                    searchTracks.getTrackUrl(params, function(error, url) {

                        if (!error && url) {
                            console.log('URL: ' + url);
                        } else {
                            console.error(error);
                        }
                    });
                    break;
                }
            } else {
                console.error(result);
            }
        } else {
            console.error('Empty response.');
        }
    } else {
        console.error(error);
    }
});
```
