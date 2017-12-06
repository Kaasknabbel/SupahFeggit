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
  var path = 'variables.js';
  var client = gh.client(vm.apikey);
  var ghme = client.me();
  var ghuser = client.user('Kaasknabbel');
  var ghrepo = client.repo('Kaasknabbel/SupahFeggit');  
  ghrepo.contents(path, (err, b) => {
    if (err) console.log(err);
    else {
      ghrepo.updateContents(path, 'Bot - Updated ' + name, content, b.sha, err => {
        console.log(err);
      });
    }
  });
}
