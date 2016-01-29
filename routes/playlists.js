var express = require('express');
var spotifyApi = require('../spotify');

var router = express.Router();

router.get('/', function(req, res, next) {
  var code = req.query.code;
  spotifyApi.getUserPlaylists('klim4x')
    .then(function(data) {
      res.json(data.body.items.map(function(item){
        return {
          name: item.name,
          id: item.id
        };
      }));
    },function(err) {
      res.redirect('/');
    });
});

module.exports = router;
