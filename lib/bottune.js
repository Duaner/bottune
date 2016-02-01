var util = require('util');
var path = require('path');
var fs = require('fs');
var Bot = require('slackbots');
var VerEx = require('verbal-expressions');
var spotifyApi = require('../spotify');
var conf = require('../.conf');
var spotify = require('spotify-node-applescript');
var randomError = require('../lib/randomDialog');


var bottune = function Constructor(settings) {
    this.settings = settings;
    this.settings.	name = this.settings.name || 'morsay';

    this.user = null;
    this.db = null;
    var listeConversation = {};

    this.nextVotes = {
      trackId: undefined,
      votes: 0
    };
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

	var parserTrack = VerEx().then('http').maybe('s').then('://').maybe('www.').then('play.spotify.com/track/').anythingBut('').endOfLine();

	var parserSearch = VerEx().then('Balance du ').anythingBut('');

  	var parserAdd = VerEx().then('wesh ').anythingBut('');

  	var paserRespondSearch = VerEx().range('0','9').then('-');

  var parserNext = VerEx().then('next').anythingBut('');

	if (parserTrack.test(message.text)) {
		this._respond(message, 'Correct');
	}
	else if (paserRespondSearch.test(message.text)){
		this._searchInConversation(message.text);
	}
	else if (parserSearch.test(message.text)){
		//Exclude balance du
		var expression = VerEx().find('Balance du ');
		var result = expression.replace(message.text, '');
		this._respond(message, "Mec j'ai dix milles morceau de ce mec tu veux quoi ? ");
    	this._search(message, result);
	}
	else if (parserAdd.test(message.text)) {
	    var expression2 = VerEx().find('wesh ');
	    var result2 = expression2.replace(message.text, '');
	    this._respond(message, 'J\'ajoute ' + result2);
	    this._add(message, result2);
	}
	else if (parserNext.test(message.text)) {
    this._next(message);
	}
};

bottune.prototype._search = function(message, request) {
  var that = this;
  spotifyApi.searchTracks('artist:' + request)
    .then(function(data) {
      console.log(request);
      //that._storeResponse(message, data.body.tracks.items);
      var tracks = data.body.tracks.items.map(function(item, index) {
        return index + " - " + item.name + " from " + item.artists[0].name + ": " + item.id;
      }).join("\n");
      if (tracks.length === 0) {
        this._respond(message, randomError(request));
      } else {
        that._respond(message, tracks);
      }
    }, function(err) {
      this._respond(message, randomError(request));
    });
};

bottune.prototype._add = function(message, trackId) {
  var query;
  var that = this;
  spotifyApi.refreshAccessToken()
    .then(function(data) {
      spotifyApi.setAccessToken(data.body.access_token);
      if (data.body.refresh_token) {
        spotifyApi.setRefreshToken(data.body.refresh_token);
      }
      if (trackId){
        spotifyApi.addTracksToPlaylist('klim4x', '1JuiVinJWbDc6hH8k6LEJe', ["spotify:track:" + trackId])
          .then(function(data) {
            that._respond(message, 'Added tracks to playlist!');
            spotify.play();
            spotify.getState(function(err,state){
              console.log(state);
            });
          }, function(err) {
            console.log('err :'+err);
            that._respond(message, 'Something went wrong!' + err);
          });
      }
  }, function(error) {
    console.log("ERROR: " + error);
  });
};

bottune.prototype._storeResponse = function(message, response){

	var channel = message.channel;

	console.log(response);
	var listSon = response.map(function(item, index){
		return item.id;
	});

	console.log('Liste son');
	console.log(listSon);
	var element = {
		'channel' : channel,
		'list' : listSon
	};

};

bottune.prototype._searchInConversation = function(message){
	var morceauChoisi = message.text;
	var channel = message.channel;
    var matches = [];
    var self = this;

    for (var i = 0; i < listeConversation.length; i++) {
    	if (listeConversation[i].channel == channel){
    		self._add(message, listeConversation[i].list[morceauChoisi]);
    		return listeConversation[i].list[morceauChoisi];
    	}

    }
    return;
}
bottune.prototype._next = function(message) {
  console.log(message);
  var that = this;
  spotify.getTrack(function(err, track){
    var currentTrackId = track.id;
    if (that.nextVotes.trackId == currentTrackId) {
      if (that.nextVotes.votes.indexOf(message.user) == -1){
          that.nextVotes.votes.push(message.user);
      }
    } else {
      that.nextVotes.trackId = currentTrackId;
      that.nextVotes.votes = [];
    }
    if (that.nextVotes.votes.length >= 5) {
      spotify.next();
      that._respond(message, 'Je passe la musique suivante!');
    } else {
      that._respond(message, 'Encore ' + (5 - that.nextVotes.votes.length) + ' pour passer à la suivante.');
    }
});
};
