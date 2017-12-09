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

exports.readBlacklist = function(cb) {
  var vm = this;
  var path = 'variables/blacklist.txt';
  var client = gh.client(vm.apikey);
  var ghme = client.me();
  var ghuser = client.user('Kaasknabbel');
  var ghrepo = client.repo('Kaasknabbel/SupahFeggit');
  ghrepo.contents(path, (err, b) => {
    if (err) console.log(err);
    else {
      var contentB64 = new Buffer(b.content, 'base64')
      var content = contentB64.toString();
      var contents = content.split("];\n");
      var blacklistContent = contents[0].substring("blacklist = [".length);
      var blacklist = blacklistContent.split("ⱡ");
      var blacklisturlContent = contents[1].substring("blacklisturl = [".length);
      var blacklisturl = blacklisturlContent.split("ⱡ");
      if (blacklist != "")
        cb(blacklist, blacklisturl);
      else
        cb([],[]);
    }
  });
}

exports.updateBlacklist = function(content) {
  var vm = this;
  var path = 'variables/blacklist.txt';
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
      var blacklistArray = content[0];
      var blacklisturlArray = content[1];
      var totalblContent = "blacklist = [";
      var totalbluContent = "blacklisturl = [";
      if (blacklistArray[0] != "") {
        for (var i = 0; i < blacklistArray.length; i++) {
          totalblContent += blacklistArray[i];
          totalbluContent += blacklisturlArray[i];
          if (i != blacklistArray.length - 1){
            totalblContent += "ⱡ";
            totalbluContent += "ⱡ";
          }
        }
      }
      totalblContent += "];";
      totalbluContent += "];";
      splitContent[0] = totalblContent;
      splitContent[1] = totalbluContent;
      var completeContent = "";
      for (var ii = 0; ii < splitContent.length; ii ++) {
        if (ii != splitContent.length - 1){
          completeContent += splitContent[ii] + "\n";
        }
      }
      ghrepo.updateContents(path, 'Bot - Updated blacklist', completeContent, b.sha, err => {
        if (err) console.log(err);
      });
    }
  });
}

module.exports = exports;
