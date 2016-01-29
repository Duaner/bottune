var util = require('util');
var path = require('path');
var fs = require('fs');
var Bot = require('slackbots');
var VerEx = require('verbal-expressions');
var spotifyApi = require('../spotify');
var conf = require('../.conf');
var spotify = require('spotify-node-applescript');


var bottune = function Constructor(settings) {
    this.settings = settings;
    console.log(this.settings);
    this.settings.	name = this.settings.name || 'morsay';

    this.user = null;
    this.db = null;
};

// inherits methods and properties from the Bot constructor
util.inherits(bottune, Bot);

module.exports = bottune;

bottune.prototype.run = function () {
    bottune.super_.call(this, this.settings);

    this.on('start', this._onStart);
    this.on('message', this._onMessage);
};

bottune.prototype._onStart = function(){
	this._loadBotUser();
	this._firstRunCheck();
};

bottune.prototype._loadBotUser = function(){
	var self = this;

	this.user = this.users.filter(function (user) {
    return user.name === self.name;
  })[0];
};

bottune.prototype._firstRunCheck = function(){

};

bottune.prototype._welcomeMessage = function(){

};

bottune.prototype._onMessage = function(message){
	console.log(message);
	if (message.type == "message" && message.user != this.user.id){
		this._parseSearch(message);
		this._respond(message);
	}
};

bottune.prototype._respond =function(messageOriginal, reponse){
	var self = this;
	//console.log('Message-----');
	//console.log(messageOriginal);
	//self.postMessageToChannel(messageOriginal.channel, 'Salut gars', {as_user: true});
	//self.postTo(messageOriginal.user, 'Salut Gros'),{as_user: true};
	self.postMessage(messageOriginal.channel, reponse, {as_user:true});
};

bottune.prototype._parseSearch = function(message){
	console.log('parse');
	console.log(message.text);

	var parserTrack = VerEx().then('http').maybe('s').then('://').maybe('www.').then('play.spotify.com/track/').anythingBut('').endOfLine();

	var parserSearch = VerEx().then('Balance du ').anythingBut('');

  var parserAdd = VerEx().then('okok ').anythingBut('');

	if (parserTrack.test(message.text)) {
		this._respond(message, 'Correct');
	}
	else if (parserSearch.test(message.text)){
		//Exclude balance du
		var expression = VerEx().find('Balance du ');
		var result = expression.replace(message.text, '');
		this._respond(message, 'Recherche' + result);
    this._search(message, result);
	}
	else if (parserAdd.test(message.text)) {
    var expression2 = VerEx().find('okok ');
    var result2 = expression2.replace(message.text, '');
    this._respond(message, 'J\'ajoute' + result2);
    this._add(message, result2);
	}
};

bottune.prototype._search = function(message, request) {
  var that = this;
  spotifyApi.searchTracks('artist:' + encodeURI(request))
    .then(function(data) {
      console.log(JSON.stringify(data.body));
      var tracks = data.body.tracks.items.map(function(item, index) {
        return index + " - " + item.name + " from " + item.artists[0].name + ": " + item.id;
      }).join("\n");
      that._respond(message, tracks);
    }, function(err) {
      this._respond(message, 'Faux !');
    });
};

bottune.prototype._add = function(message, trackId) {
  var query;
  var that = this;
  spotifyApi.refreshAccessToken()
    .then(function(data) {
      console.log("Token refreshed");
      spotifyApi.setAccessToken(data.body.access_token);
      if (data.body.refresh_token) {
        spotifyApi.setRefreshToken(data.body.refresh_token);
      }
      if (trackId){
        console.log("C'est parti!!!");
        spotifyApi.addTracksToPlaylist('klim4x', '1JuiVinJWbDc6hH8k6LEJe', ["spotify:track:" + trackId]);
          .then(function(data) {
            that._respond(message, 'Added tracks to playlist!');
            spotify.play();
          }, function(err) {
            console.log('err :'+err);
            that._respond(message, 'Something went wrong!' + err);
          });
      }
  }, function(error) {
    console.log("ERROR: " + error);
  });
};
