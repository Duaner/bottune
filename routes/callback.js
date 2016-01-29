var express = require('express');
var spotifyApi = require('../spotify');

var router = express.Router();

router.get('/', function(req, res, next) {
  var code = req.query.code;
  spotifyApi.authorizationCodeGrant(code)
  .then(function(data) {
    console.log('The token expires in ' + data.body.expires_in);
    console.log('The access token is ' + data.body.access_token);
    console.log('The refresh token is ' + data.body.refresh_token);

    // Set the access token on the API object to use it in later calls
    spotifyApi.setAccessToken(data.body.access_token);
    spotifyApi.setRefreshToken(data.body.refresh_token);
    res.redirect('/search');
  }, function(err) {
    console.log('Something went wrong!', err);
  });
});

module.exports = router;
