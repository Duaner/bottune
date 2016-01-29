var error = require('./dialog/error');
var answer = require('./dialog/answer');
var loading = require('./dialog/loading');
var question = require('./dialog/question');


module.exports = function randomError(query) {
  var items = error(query);
  return items[Math.floor(Math.random()*items.length)];
};

module.exports = function randomAnswer(query) {
  var items = answer(query);
  return items[Math.floor(Math.random()*items.length)];
};

module.exports = function randomLoading(query) {
  var items = loading(query);
  return items[Math.floor(Math.random()*items.length)];
};

module.exports = function randomQuestion(text, query) {
  if (!question.indexOf(cleanString(text))) return;
  return question[Math.floor(Math.random()*question.length)];
};


function cleanString(str) {
  // + remove accents
  return str.lowercase;
}