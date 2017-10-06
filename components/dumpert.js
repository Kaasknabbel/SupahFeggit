var request = require('request');
var Helper = require('./helper.js');

var exports = {};

module.exports = Dumpert = function() {
  var vm = this;
}

Dumpert.prototype.getTop5 = function(args, message) {
  request('http://www.dumpert.nl/toppers/', (error, response, body) => {
    var bodyArray = body.split('\n');
    var top5 = [];
    for (var line = 151; line < 191; line += 10) {
      var link = bodyArray[line].split('"');
      top5.push(link);
    }
    console.log(top5);
  });
}
