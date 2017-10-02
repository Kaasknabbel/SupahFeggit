var request = require('request');
var Helper = require('./helper.js');

var exports = {};

module.exports = Dumpert = function() {
  var vm = this;
}

Dumpert.prototype.getTop5 = function(message) {
  var vm = this;
  request('http://www.dumpert.nl/toppers/', (error, response, body) => {
  message.reply(Helper.wrap(body));
  });
}
