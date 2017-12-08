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

exports.initialiseVariables = function() {
  var vm = this;
  var path = 'components/variables.js';
  var client = gh.client(vm.apikey);
  var ghme = client.me();
  var ghuser = client.user('Kaasknabbel');
  var ghrepo = client.repo('Kaasknabbel/SupahFeggit');
  ghrepo.contents(path, (err, b) => {
    if (err) console.log(err);
    else {
      var contentB64 = new Buffer(b.content, 'base64')
      var content = contentB64.toString();
      var contents = content.split("\'\n");
      var blacklistContent = contents[0].substring("Blacklist: \'".length);
      vm.blacklist = blacklistContent.split(',');
      var blacklisturlContent = contents[1].substring("Blacklisturl: \'".length);
      vm.blacklisturl = blacklisturlContent.split(',');
    }
  });
  console.log('gh: ' + vm.blacklist);
}

exports.updateVariables = function(name, content) {
  var vm = this;
  var path = 'components/variables.js';
  var client = gh.client(vm.apikey);
  var ghme = client.me();
  var ghuser = client.user('Kaasknabbel');
  var ghrepo = client.repo('Kaasknabbel/SupahFeggit');
  ghrepo.contents(path, (err, b) => {
    if (err) console.log(err);
    else {
      var contentB64 = new Buffer(b.content, 'base64')
      var currentContent = contentB64.toString();
      var splitContent = currentContent.split("\n");
      if (name == 'blacklist') {
        var blacklistArray = content[0].toString().split(",");
        var blacklisturlArray = content[1].toString().split(",");
        var totalblContent = "  vm.blacklist = [";
        var totalbluContent = "  vm.blacklisturl = [";
        for (var i = 0; i < blacklistArray.length; i++) {
          totalblContent +=  "'" + blacklistArray[i] + "'";
          totalbluContent +=  "'" + blacklisturlArray[i] + "'";
          if (i != blacklistArray.length - 1){
            totalblContent += ",";
            totalbluContent += ",";
          }
        }
        totalblContent += "];";
        totalbluContent += "];";
        splitContent[4] = totalblContent;
        splitContent[5] = totalbluContent;
      }
      var completeContent = "";
      for (var ii = 0; ii < splitContent.length; ii ++) {
        if (ii != splitContent.length - 1){
          completeContent += splitContent[ii] + "\n";
        }
      }
      ghrepo.updateContents(path, 'Bot - Updated ' + name, completeContent, b.sha, err => {
        if (err) console.log(err);
      });
    }
  });
}

module.exports = exports;
