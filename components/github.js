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

Github.prototype.updateVariable = function(name, content) {
  var vm = this;
  getGHvars(); 
  var sha = '082b8fa8d42d6c528e7255b20da12189218b8d31';
  ghrepo.updateContents('variables.js', 'Bot - Updated ' + name, content, sha, err => {
    console.log(err);
  });
}

Github.prototype.getSHA = function(path) {
  getGHvars();
}

function getGHvars() {
  var vm = this;
  var client = gh.client(vm.apikey);
  var ghme = client.me();
  var ghuser = client.user('Kaasknabbel');
  var ghrepo = client.repo('Kaasknabbel/SupahFeggit');  
}
