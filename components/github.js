var request = require('request');
var Helper = require('./helper.js');
var gh = require('octonode');

var exports = {};

module.exports = Github = function() {
  var vm = this;
  var client = gh.client(vm.apikey);
  exports.ghme = client.me();
  exports.ghuser = client.user('Kaasknabbel');
  exports.ghrepo = client.repo('Kaasknabbel/SupahFeggit');
  Helper.keys('apikeys', ['github']).then(function(keys) {
    vm.apikey = keys.github;
  }).catch(err => {
    console.log(err);
    vm.hasUnmetDepedencies = true;
  });
}

Github.prototype.updateVariable = function(name, content) {
  var vm = this;
  var sha = '30d74d258442c7c65512eafab474568dd706c430';
  exports.ghrepo.updateContents('variables.js', 'Bot - Updated ' + name, content, sha, err => {
    console.log(err);
  });
}
