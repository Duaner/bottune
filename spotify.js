var conf = require('./.conf');

var SpotifyWebApi = require('spotify-web-api-node');

var spotifyApi = new SpotifyWebApi(conf);
spotifyApi.setRefreshToken(conf.refresh);

module.exports = spotifyApi;
