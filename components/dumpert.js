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
    for (var line = 151; line <= 191; line += 10) {
      var link = bodyArray[line].split('"');
      top5.push(link[1]);
    }
    if (args === '-full' || args === '-f') message.reply('\nThe current dumpert top 5:\n  #1: ' + top5[0] + '\n  #2: ' + top5[1] + '\n  #3: ' + top5[2] + '\n  #4: ' + top5[3] + '\n  #5: ' + top5[4]);
    else message.reply('\nThe current dumpert top 5:\n  #1: <' + top5[0] + '>\n  #2: <' + top5[1] + '>\n  #3: <' + top5[2] + '>\n  #4: <' + top5[3] + '>\n  #5: <' + top5[4] + '>');
  });
}
