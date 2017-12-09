var Helper = require('./helper.js');
var Github = require('./github.js');

var exports = {};

module.exports = Playlist = function() {
  var vm = this;
}

Playlist.prototype.newPlaylist = function(message, name) {
  var vm = this;
  var user = message.author.username;
  Github.readPlaylist(user, name, (userPlaylists,playlist,playlisturl) => {
    if (playlist == []) {
      message.reply(Helper.wrap("Playlist '" + name + "' has been created, " + user + "."));
    }
    else message.reply(Helper.wrap("You already have a playlist with the name: '" + name + "'\nPlease give a unique name to your new playlist, feggit."));
  }
}
