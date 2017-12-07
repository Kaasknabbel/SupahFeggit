var request = require('request');
var Helper = require('./helper.js');
var gh = require('octonode');
var Queue = require('./queue.js');

var exports = {};

exports.init = function() {
  var vm = this;
  vm.blacklist = [];
  vm.blacklisturl = [];
  Helper.keys('apikeys', ['github']).then(function(keys) {
    vm.apikey = keys.github;
  }).catch(err => {
    console.log(err);
    vm.hasUnmetDepedencies = true;
  });
}
exports.init();

exports.initialiseVariables = function() {
  var vm = this;
  var path = 'variables.js';
  var client = gh.client(vm.apikey);
  var ghme = client.me();
  var ghuser = client.user('Kaasknabbel');
  var ghrepo = client.repo('Kaasknabbel/SupahFeggit');
  ghrepo.contents(path, (err, b) => {
    if (err) console.log(err);
    else {
      var contentB64 = new Buffer(b.content, 'base64')
      var content = contentB64.toString();
      vm.splitVariables(content);
    }
  });
}

exports.splitVariables = function(content) {
  var vm = this;
  var contents = content.split("\'\n");
  var blacklistContent = contents[0].substring("Blacklist: \'".length);
  vm.blacklist = blacklistContent.split(',');
  var blacklisturlContent = contents[1].substring("Blacklisturl: \'".length);
  vm.blacklisturl = blacklisturlContent.split(',');
  Queue.initialise();
}

exports.updateVariables = function(name, content) {
  var vm = this;
  var path = 'variables.js';
  var client = gh.client(vm.apikey);
  var ghme = client.me();
  var ghuser = client.user('Kaasknabbel');
  var ghrepo = client.repo('Kaasknabbel/SupahFeggit');
  if (name == 'blacklist') {
    vm.blacklist = "'" + content[0] + "'";
    vm.blacklisturl = "'" + content[1] + "'";
  }
  var completeContent = 'Blacklist: ' + vm.blacklist + '\nBlacklisturl: ' + vm.blacklisturl;
  ghrepo.contents(path, (err, b) => {
    if (err) console.log(err);
    else {
      ghrepo.updateContents(path, 'Bot - Updated ' + name, completeContent, b.sha, err => {
        if (err) console.log(err);
      });
    }
  });
}

module.exports = exports;
