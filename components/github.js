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

exports.readPlaylist = function(user,name,cb) {
  var vm = this;
  var path = 'variables/playlists.txt';
  var client = gh.client(vm.apikey);
  var ghme = client.me();
  var ghuser = client.user('Kaasknabbel');
  var ghrepo = client.repo('Kaasknabbel/SupahFeggit');
  ghrepo.contents(path, (err, b) => {
    if (err) console.log(err);
    else {
      var contentB64 = new Buffer(b.content, 'base64')
      var content = contentB64.toString();
      var contents = content.split("\n");
      var userPlaylists = [];
      var playlist = [];
      var playlisturl = [];
      if (contents[0] != "") {
        for (var i = 0; i < contents.length; i += 2) {
          if (contents[i].endsWith("];")) {
            contents[i] = contents[i].substring(0, contents[i].length - 2);
          }
          if (contents[i + 1].endsWith("];")) {
            contents[i + 1] = contents[i + 1].substring(0, contents[i + 1].length - 2);
          }
          var playlistContent = contents[i].substring("playlist(".length);
          var playlistUser = playlistContent.split("ⱡ",2);
          console.log(playlistUser);
          if (playlistUser[0] == user) {
            var playlistName = playlistUser[1].split(") = [",2);
            userPlaylists.push(playlistName[0]);
            if (playlistName[0] == name) {
              playlist = playlistName[1].split("ⱡ");
              console.log(playlist);
              console.log(playlistName[1]);
              var playlistPath = "playlisturl(" + playlistUser[0] + "ⱡ" + playlistName[0] + ") = [";
              var playlisturlContent = contents[i + 1].substring(playlistPath.length);
              playlisturl = playlisturlContent.split("ⱡ");
            }
          }
        }
      }
      cb(userPlaylists,playlist,playlisturl);
    }
  });
}

exports.updatePlaylist = function(user,name,content) {
  var vm = this;
  var path = 'variables/playlists.txt';
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
      var userPlaylists = [];
      var playlist = [];
      var playlisturl = [];
      var listExists = false;
      var listLine = -1;
      var newPlaylist = "";
      var newPlaylisturl = "";
      var completeContent = "";
      if (splitContent[0] != "") {
        for (var i = 0; i < splitContent.length; i += 2) {
          if (splitContent[i].endsWith("];")) {
            splitContent[i] = splitContent[i].substring(0, splitContent[i].length - 2);
          }
          if (splitContent[i + 1].endsWith("];")) {
            splitContent[i + 1] = splitContent[i + 1].substring(0, splitContent[i + 1].length - 2);
          }
          var playlistContent = splitContent[i].substring("playlist(".length);
          var playlistUser = playlistContent.split("ⱡ",2);
          if (playlistUser[0] == user) {
            var playlistName = playlistUser[1].split(") = [",2);
            userPlaylists.push(playlistName[0]);
            if (playlistName[0] == name) {
              listExists = true;
              listLine = i + 1;
              playlist = playlistName[1].split("ⱡ");
              var playlistPath = "playlisturl(" + playlistUser[0] + "ⱡ" + playlistName[0] + ") = [";
              var playlisturlContent = splitContent[i + 1].substring(playlistPath.length);
              playlisturl = playlisturlContent.split("ⱡ");
            }
          }
        }
        if (content == "") {
          if (listExists == false) {
            newPlaylist = "playlist(" + user + "ⱡ" + name + ") = [];";
            newPlaylisturl = "playlisturl(" + user + "ⱡ" + name + ") = [];";
            completeContent = currentContent + "\n" + newPlaylist + "\n" + newPlaylisturl;
          }
          else {
            newPlaylist = "playlist(" + user + "ⱡ" + name + ") = [];";
            newPlaylisturl = "playlisturl(" + user + "ⱡ" + name + ") = [];";
            splitContent[listLine - 1] = newPlaylist;
            splitContent[listLine] = newPlaylisturl;
            for (var ii = 0; ii < splitContent.length; ii ++) {
              if (ii != splitContent.length - 1){
                completeContent += splitContent[ii] + "\n";
              }
              else
                completeContent += splitContent[ii];
            }
          }
        }
        else if (content == "-1") {
          splitContent.splice((listLine - 1), 2);
          for (var ii = 0; ii < splitContent.length; ii ++) {
            if (ii != splitContent.length - 1){
              completeContent += splitContent[ii] + "\n";
            }
            else
              completeContent += splitContent[ii];
          }
        } 
        else {
          var newPlaylistContent = content[0];
          var newPlaylisturlContent = content[1];
          var totalPlaylistContent = "";
          var totalPlaylisturlContent = "";
          for (var i = 0; i < newPlaylistContent.length; i++) {
            totalPlaylistContent += newPlaylistContent[i];
            totalPlaylisturlContent += newPlaylisturlContent[i];
            if (i != newPlaylistContent.length - 1){
              totalPlaylistContent += "ⱡ";
              totalPlaylisturlContent += "ⱡ";
            }
          }
          newPlaylist = "playlist(" + user + "ⱡ" + name + ") = [" + totalPlaylistContent + "];";
          newPlaylisturl = "playlisturl(" + user + "ⱡ" + name + ") = [" + totalPlaylisturlContent + "];";
          splitContent[listLine - 1] = newPlaylist;
          splitContent[listLine] = newPlaylisturl;
          for (var ii = 0; ii < splitContent.length; ii ++) {
            if (ii != splitContent.length - 1){
              completeContent += splitContent[ii] + "\n";
            }
            else
              completeContent += splitContent[ii];
          }
        }
      }
      else {
        if (content == "") {
          newPlaylist = "playlist(" + user + "ⱡ" + name + ") = [];";
          newPlaylisturl = "playlisturl(" + user + "ⱡ" + name + ") = [];";
          completeContent = newPlaylist + "\n" + newPlaylisturl;
        }
      }
      ghrepo.updateContents(path, 'Bot - Updated playlists', completeContent, b.sha, err => {
        if (err) console.log(err);
      });
    }
  });
}

module.exports = exports;
