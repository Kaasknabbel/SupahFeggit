var Helper = require('./helper.js');
var Github = require('./github.js');

var exports = {};

module.exports = Playlist = function() {
  var vm = this;
}

Playlist.prototype.newPlaylist = function(name, message) {
  var vm = this;
  var user = message.author.username;
  Github.readPlaylist(user, name, (userPlaylists,playlist,playlisturl) => {
    if (playlist[0] == undefined) {
      Github.updatePlaylist(user, name, "");
      message.reply(Helper.wrap("Playlist '" + name + "' has been created, feggit."));
    }
    else message.reply(Helper.wrap("You already have a playlist with the name: '" + name + "'\nPlease give a unique name to your new playlist, feggit."));
  });
}

Playlist.prototype.deletePlaylist = function(name, message) {
  var vm = this;
  var user = message.author.username;
  Github.readPlaylist(user, name, (userPlaylists,playlist,playlisturl) => {
    if (playlist[0] != undefined) {
      Github.updatePlaylist(user, name, "-1");
      message.reply(Helper.wrap("Playlist '" + name + "' has been deleted, feggit."));
    }
    else message.reply(Helper.wrap("You don't have a playlist with the name: '" + name + "', feggit."));
  });
}
