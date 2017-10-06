var request = require('request');
var Helper = require('./helper.js');

var exports = {};

module.exports = Dumpert = function() {
  var vm = this;
}

Dumpert.prototype.getTop5 = function(args, message) {
  request('http://www.dumpert.nl/toppers/', (error, response, body) => {
    var bodystr = body.toString();
  //message.reply(Helper.wrap(body));
  console.log('body:', bodystr);
  });
}
