

var express = require('express');
var spotifyApi = require('../spotify');

var router = express.Router();

router.get('/', function(req, res, next) {
  var trackId = req.query.trackId;
  if (trackId){
    spotifyApi.addTracksToPlaylist('klim4x', '1JuiVinJWbDc6hH8k6LEJe', ["spotify:track:" + trackId])
      .then(function(data) {
        res.json({result: 'Added tracks to playlist!'});
      }, function(err) {
        res.json({result: 'Something went wrong!', err: err});
      });
  }
});

module.exports = router;
