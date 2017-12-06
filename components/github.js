var request = require('request');
var Helper = require('./helper.js');
var gh = require('octonode');

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

exports.initialiseVariables = function(content) {
  var vm = this;
}

exports.updateVariables = function(name, content) {
  var vm = this;
  var path = 'variables.js';
  var client = gh.client(vm.apikey);
  var ghme = client.me();
  var ghuser = client.user('Kaasknabbel');
  var ghrepo = client.repo('Kaasknabbel/SupahFeggit');
  if (name = 'blacklist')
    vm.blacklist = "'" + content + "'";
  else if (name = 'blacklisturl')
    vm.blacklisturl = "'" + content + "'";
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
