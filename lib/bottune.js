'use strict';

var util = require('util');
var path = require('path');
var fs = require('fs');
var Bot = require('slackbots');

var bottune = function Constructor(settings) {
    this.settings = settings;
    this.settings.name = this.settings.name || 'bottune';

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
}

bottune.prototype._loadBotUser = function(){
	var self = this;
	this.user = this.users.filter(function (user) {
        return user.name === self.name;
    })[0];
}

bottune.prototype._firstRunCheck = function(){

}

bottune.prototype._welcomeMessage = function(){

}

bottune.prototype._onMessage = function(message){
	if (message.type == "message"){
		this._respond(message);
	}
}

bottune.prototype._respond =function(messageOriginal){
	var self = this;
	console.log('Message-----');
	console.log(messageOriginal);
	//self.postMessageToChannel(messageOriginal.channel, 'Salut gars', {as_user: true});
	//self.postTo(messageOriginal.user, 'Salut Gros'),{as_user: true};
	self.postMessage(messageOriginal.channel, 'Salut José', {as_user:true})
}

