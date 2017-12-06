var request = require('request');
var Helper = require('./helper.js');
var gh = require('octonode');

var exports = {};

module.exports = GitHub = function() {
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
