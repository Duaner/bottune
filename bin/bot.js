#!/usr/bin/env node

'use strict';

/**
 * NorrisBot launcher script.
 *
 * @author Luciano Mammino <lucianomammino@gmail.com>
 */

var bottune = require('../lib/bottune.js');

/**
 * Environment variables used to configure the bot:
 *
 *  BOT_API_KEY : the authentication token to allow the bot to connect to your slack organization. You can get your
 *      token at the following url: https://<yourorganization>.slack.com/services/new/bot (Mandatory)
 *  BOT_DB_PATH: the path of the SQLite database used by the bot
 *  BOT_NAME: the username you want to give to the bot within your organisation.
 */
var token = "xoxb-19779077654-uMCtH6xOtRRJtjphWxwFknN6"
var name = "morsay";
var id = "U0KNX29K8";

var bottune = new bottune({
    token: token,
    name: name
});

bottune.run();
