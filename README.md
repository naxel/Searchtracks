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

            if (response.success) {

                console.log('Found tracks: ' + response.count);

                for (var track in response.tracks) {
                    console.log('First track: ' + response.tracks[track].artist + ' - ' + response.tracks[track].track);

                    var params = {
                        track_id: response.tracks[track].id
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
                console.error(response);
            }
        } else {
            console.error('Empty response.');
        }
    } else {
        console.error(error);
    }
});
```
