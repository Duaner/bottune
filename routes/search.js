var express = require('express');
var spotifyApi = require('../spotify');

var router = express.Router();

router.get('/', function(req, res, next) {
  var artist = req.query.artist;
  spotifyApi.searchTracks('artist:' + artist)
  .then(function(data) {
    res.json(data.body.tracks);
  }, function(err) {
    console.log('Something went wrong!', err);
  });
});

module.exports = router;
