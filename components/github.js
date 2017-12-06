var request = require('request');
var Helper = require('./helper.js');
var gh = require('octonode');

var exports = {};

module.exports = Github = function() {
  var vm = this;
  Helper.keys('apikeys', ['github']).then(function(keys) {
    vm.apikey = keys.github;
  }).catch(err => {
    console.log(err);
    vm.hasUnmetDepedencies = true;
  });
}

var client = gh.client(this.apikey);
var ghuser = client.user('Kaasknabbel');
var ghrepo = client.repo('Kaasknabbel/SupahFeggit');

Github.prototype.updateVariable = function(name, content) {
  var vm = this;
  ghrepo.updateContents('variables.js', 'Bot - Updated ' + name, content, '8b137891791fe96927ad78e64b0aad7bded08bdc', err => console.log(err));
}
