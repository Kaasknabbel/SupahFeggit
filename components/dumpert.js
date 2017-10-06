var request = require('request');
var Helper = require('./helper.js');

var exports = {};

module.exports = Dumpert = function() {
  var vm = this;
}

Dumpert.prototype.getTop5 = function(args, message) {
  request('http://www.dumpert.nl/toppers/', (error, response, body) => {
    var lines = body.split('\n');
    console.log('body:', lines[152]);
  });
}
