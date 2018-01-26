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
    else message.reply(Helper.wrap("You already have a playlist with the name '" + name + "'\nPlease give a unique name to your new playlist, feggit."));
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
    else message.reply(Helper.wrap("You don't have a playlist with the name '" + name + "', feggit."));
  });
}

Playlist.prototype.showPlaylist = function(args, message) {
  var vm = this;
  var user = message.author.username;
  var toReturn = "";
  if (args == "") {
    Github.readPlaylist(user, undefined, (userPlaylists,playlist,playlisturl) => {
      if (userPlaylists[0] != undefined) {
        toReturn = "Your playlists:";
        for (var i = 0; i < userPlaylists.length; i++) {
          toReturn += "\n[" + (i + 1) + "]  " + userPlaylists[i];
          if (i == 30 || i == 60 || i == 90 || i == 120 || i == 150) {
            if (i < (userPlaylists.length - 1)) {
              message.reply(Helper.wrap(toReturn));
              toReturn = '';
            }
          }
        }
        message.reply(Helper.wrap(toReturn));
      }
      else message.reply(Helper.wrap("You don't have any playlists, feggit.\nYou can create one with the command: !playlist.new [name]"));
    });
  }
  else if (message.mentions.users.size === 0) {
    Github.readPlaylist(user,args, (userPlaylists,playlist,playlisturl) => {
      if (userPlaylists.includes(args)) {
        if (playlist[0] != "") {
          toReturn = "Your playlist '" + args + "':";
          for (var i = 0; i < playlist.length; i++) {
            toReturn += "\n[" + (i + 1) + "]  " + playlist[i];
            if (i == 30 || i == 60 || i == 90 || i == 120 || i == 150) {
              if (i < (playlist.length - 1)) {
                message.reply(Helper.wrap(toReturn));
                toReturn = '';
              }
            }
          }
          message.reply(Helper.wrap(toReturn));
        }
        else message.reply(Helper.wrap("Your playlist '" + args + "' is empty, feggit."));
      }
      else message.reply(Helper.wrap("You don't have a playlist with the name: '" + args + "', feggit."));
    });
  }
  else {
    user = message.guild.member(message.mentions.users.first()).user.username;
    var argsArray = args.split(" ");
    if (argsArray[1] != undefined) {
      var name = argsArray.slice(1).join(" ");
      Github.readPlaylist(user,name, (userPlaylists,playlist,playlisturl) => {
        if (userPlaylists.includes(name)) {
          if (playlist[0] != "") {
            toReturn = user + "'s playlist '" + name + "':";
            for (var i = 0; i < playlist.length; i++) {
              toReturn += "\n[" + (i + 1) + "]  " + playlist[i];
              if (i == 30 || i == 60 || i == 90 || i == 120 || i == 150) {
                if (i < (playlist.length - 1)) {
                  message.reply(Helper.wrap(toReturn));
                  toReturn = '';
                }
              }
            }
            message.reply(Helper.wrap(toReturn));
          }
          else message.reply(Helper.wrap(user + "'s playlist '" + name + "' is empty, feggit."));
        }
        else message.reply(Helper.wrap(user + " has no playlist with the name '" + name + "', feggit.\nCommand help: !playlist [user(optional)] [name(optional)]"));
      });
    }
    else {
      Github.readPlaylist(user, undefined, (userPlaylists,playlist,playlisturl) => {
        if (userPlaylists[0] != undefined) {
          toReturn = user + "'s playlists:";
          for (var i = 0; i < userPlaylists.length; i++) {
            toReturn += "\n[" + (i + 1) + "]  " + userPlaylists[i];
            if (i == 30 || i == 60 || i == 90 || i == 120 || i == 150) {
              if (i < (userPlaylists.length - 1)) {
                message.reply(Helper.wrap(toReturn));
                toReturn = '';
              }
            }
          }
          message.reply(Helper.wrap(toReturn));
        }
        else message.reply(Helper.wrap(user + " doesn't have any playlists, feggit."));
      });
    }
  } 
}

Playlist.prototype.addSong = function(name, track, message) {
  var vm = this;
  var user = message.author.username;
  Github.readPlaylist(user, name, (userPlaylists,playlist,playlisturl) => {
    if (userPlaylists.includes(name)) {
      if (playlist[0] == "") {
        playlist[0] = track.title;
        playlisturl[0] = track.url;
      }
      else {
        playlist.push(track.title);
        playlisturl.push(track.url);
      }
      Github.updatePlaylist(user, name, [playlist, playlisturl]);
      message.reply(Helper.wrap("'" + track.title + "' has been added to your playlist '" + name + "'."));
    }
    else message.reply(Helper.wrap("You don't have a playlist with the name '" + name + "', feggit.\nCommand help: !playlist.add [playlist] [song]"));
  });
}

Playlist.prototype.removeSong = function(name, track, message) {
  var vm = this;
  var user = message.author.username;
  Github.readPlaylist(user, name, (userPlaylists,playlist,playlisturl) => {
    if (userPlaylists.includes(name)) {
      if (playlist.includes(track.title)) {
        for (var i = 0; i < playlist.length; i++) {
          if (playlisturl[i] == track.url) {
            playlist.splice(i, 1);
            playlisturl.splice(i, 1);
            Github.updatePlaylist(user, name, [playlist, playlisturl]);
            return message.reply(Helper.wrap("'" + track.title + "' has been removed from your playlist '" + name + "'."));
          }
        }
      }
      else message.reply(Helper.wrap("'" + track.title + "' is not on your playlist '" + name + "', feggit."));
    }
    else message.reply(Helper.wrap("You don't have a playlist with the name '" + name + "', feggit.\nCommand help: !playlist.remove [playlist] [song]"));
  });
}
