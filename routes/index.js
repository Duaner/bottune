var express = require('express');
var conf = require('../.conf');
var spotifyApi = require('../spotify');

var router = express.Router();

var scopes = ['playlist-modify-public', 'playlist-modify-private'];
var state = 'some-state-of-my-choice';

/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect(spotifyApi.createAuthorizeURL(scopes, state));
});


module.exports = router;
