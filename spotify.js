var conf = require('./.conf');
var request = require('request');

var SpotifyWebApi = require('spotify-web-api-node');

var spotifyApi = new SpotifyWebApi(conf);
var scopes = ['playlist-modify-public', 'playlist-modify-private'];
var state = 'some-state-of-my-choice';
var url = spotifyApi.createAuthorizeURL(scopes, state);
console.log(url);
spotifyApi.authorizationCodeGrant(conf.code)
  .then(function(data) {
    console.log('The token expires in ' + data.body.expires_in);
    console.log('The access token is ' + data.body.access_token);
    console.log('The refresh token is ' + data.body.refresh_token);

    // Set the access token on the API object to use it in later calls
    spotifyApi.setAccessToken(data.body.access_token);
    spotifyApi.setRefreshToken(data.body.refresh_token);
  }, function(err) {
    console.log('Error while setting access token');
    console.log(err);
  });

module.exports = spotifyApi;
