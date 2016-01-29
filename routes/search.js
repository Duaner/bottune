var express = require('express');
var spotifyApi = require('../spotify');

var router = express.Router();

router.get('/', function(req, res, next) {
  var artist = req.query.artist;
  spotifyApi.searchTracks('artist:' + artist)
  .then(function(data) {
    res.json(data.body.tracks.items.map(function(item) {
      return {
        id: item.id,
        name: item.name,
        artist: item.artists[0].name
      };
    }));
  }, function(err) {
    console.log('Something went wrong!', err);
  });
});

module.exports = router;
