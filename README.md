Searchtracks
============

Search Tracks

Example:

```js
var Prostopleer = require('searchtracks/prostopleer');
var SearchTracks = require('searchtracks');

var searchTracks = new SearchTracks(new Prostopleer());


var params = {
    query: 'slot',
    limit: 20
};
searchTracks.search(params, function(result) {
    console.log(result);
});
```
