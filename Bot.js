var Discord = require('discord.js');
var Bot = new Discord.Client();
var Helper = require('./components/helper.js');
var Queue = require('./components/queue.js');
var Playlist = require('./components/playlist.js');
var TrackHelper = require('./components/trackhelper.js');
var WordService = require('./components/wordservice.js');
var WeatherService = require('./components/weatherservice.js');
var Dumpert = require('./components/dumpert.js');
var Prison = require('./components/prison.js');
var Github = require('./components/github.js');
var Music = require('discord.js-musicbot-addon');

var soundEnabled = true;

Helper.keys('apikeys', ['youtube']).then(function(keys) {
  const music = new Music(Bot, {
    youtubeKey: keys.youtube,  // youtube api key
    botAdmins: Helper.jh, // set admins 
    prefix: '!',             // Prefix for the commands.
    thumbnailType: 'high',
    global: true,            // Non-server-specific queues.
    maxQueueSize: 50,        // Maximum queue size of 25.
    defVolume: 20,
    anyoneCanSkip: false,
    anyoneCanAdjust: false,
    ownerOverMember: true,
    botOwner: Helper.jh,
    logging: false,
    enableAliveMessage: false,
    requesterName: true,
    clearInvoker: false,      // If permissions applicable, allow the bot to delete the messages that invoke it.
    inlineEmbeds: false,
    helpCmd: 'mhelp',        // Sets the name for the help command.
    playCmd: 'queue',        // Sets the name for the 'play' command.
    playAlt: ["q"],
    skipCmd: 'skip',
    queueCmd: 'list',
    pauseCmd: 'pause',
    resumeCmd: 'play',
    clearCmd: 'clear',
    disableSet: 'true',
    disableOwnerCmd: 'true',
    volumeCmd: 'volume',     // Sets the name for the 'volume' command.
    leaveCmd: 'leave',      // Sets the name for the 'leave' command.
    disableLoop: false        // Disable the loop command.
  });
  }).catch(err => {
    console.log(err);
});

var commands = {
  '!video': {
    execute: getVideo,
    description: 'Get a youtube video by search word'
  },
  '!weather': {
    execute: getWeather,
    description: 'Get current weather for the given city, defaults to Asten'
  },
  '!roll': {
    execute: roll,
    description: 'Roll from 1-100'
  },
  '!help': {
    execute: showHelp,
    description: 'Show all the available commands'
  },
  '!words': {
    execute: countWordsByUser,
    description: 'Get the most popular words for user of the given username, defaults to your username'
  },
/*'!music': {
    execute: showMusic,
    description: 'Get a list of available music commands'
  },
  '!queue': {
    execute: doQueueInfo,
    description: 'Queue your song [Short command: !q]'
  },
  '!q': {
    execute: doQueueInfo,
    description: 'Short command of: !queue'
  },
  '!queue.playlist': {
    execute: doQueuePlaylist,
    description: 'Queue a playlist [Short command: !q.pl]'
  },
  '!queue.playlist.random': {
    execute: doQueuePlaylistRandom,
    description: 'Queue a playlist [Short command: !q.plr]'
  },
  '!q.pl': {
    execute: doQueuePlaylist,
    description: 'Short command of: !queue.playlist'
  },
  '!q.plr': {
    execute: doQueuePlaylistRandom,
    description: 'Short command of: !queue.playlist.random'
  },
  '!voteskip': {
    execute: voteSkip,
    description: 'Vote to skip the current song'
  },
  '!song': {
    execute: showSong,
    description: 'Get the current song'
  },
  '!list': {
    execute: getQueueList,
    description: 'Get a list of the current queue'
  },
  '!forward': {
    execute: forwardQueue,
    description: 'Admin only - move a song forward so it is the next song in the queue'
  },
  '!remove': {
    execute: removeFromQueue,
    description: 'Admin only - remove a specific song from the queue'
  },
  '!blacklist': {
    execute: blacklist,
    description: 'Show blacklist or (-Admin only-) add a song to the blacklist'
  },
  '!whitelist': {
    execute: whitelist,
    description: 'Admin only - remove a song from the blacklist'
  },
  '!playlist': {
    execute: showPlaylist,
    description: 'Show your own or others playlists [Short command: !pl]'
  },
  '!playlist.help': {
    execute: helpPlaylist,
    description: 'Get more info about the available playlist commands [Short command: !pl.help]'
  },
  '!playlist.new': {
    execute: newPlaylist,
    description: 'Create a new playlist [Short command: !pl.new]'
  },
  '!playlist.delete': {
    execute: deletePlaylist,
    description: 'Delete an existing playlist [Short command: !pl.delete]'
  },
  '!playlist.add': {
    execute: addPlaylist,
    description: 'Add a song to one of your playlists [Short command: !pl.add]'
  },
  '!playlist.remove': {
    execute: removePlaylist,
    description: 'Remove a song from one of your playlists [Short command: !pl.remove]'
  },
  '!pl': {
    execute: showPlaylist,
    description: 'Show your own or others playlists'
  },
  '!pl.help': {
    execute: helpPlaylist,
    description: 'Get more info about the available playlist commands'
  },
  '!pl.new': {
    execute: newPlaylist,
    description: 'Create a new playlist'
  },
  '!pl.delete': {
    execute: deletePlaylist,
    description: 'Delete an existing playlist'
  },
  '!pl.add': {
    execute: addPlaylist,
    description: 'Add a song to one of your playlists'
  },
  '!pl.remove': {
    execute: removePlaylist,
    description: 'Remove a song from one of your playlists'
  },
  '!sounds': {
    execute: showSounds,
    description: 'Get a list of the available sound samples'
  },
  '!skraa': {
    execute: skraa,
    description: 'THE THING GOES SKRAA!'
  },
  '!whatislove': {
    execute: whatislove,
    description: 'What is love?'
  },
  '!gaaay': {
    execute: gaaay,
    description: 'Ha, gaaaaay!'
  },
  '!krakaka': {
    execute: krakaka,
    description: 'Krakaka!'
  },
  '!moeder': {
    execute: moeder,
    description: 'Ik neuk jullie allemaal de moeder'
  },
  '!nomoney': {
    execute: nomoney,
    description: 'What, no money? Hier suck a cock!'
  },
  '!gandalf': {
    execute: gandalf,
    description: 'Gandalf, we must turn back!'
  },
  '!oceanman': {
    execute: oceanman,
    description: 'Ocean man, take me by the hand!'
  },*/
  '!personal': {
    execute: personalQuote,
    description: 'Get your own personal message'
  },
  '!dumpert': {
    execute: dumpertTop5,
    description: 'Get the current top 5 of Dumpert'
  },
  '!admin': {
    execute: rickroll,
    description: 'Give yourself admin privileges'
  },
/*'!togglesound': {
    execute: toggleSound,
    description: 'Admin only - enable or disable bot sound/music commands'
  },
  '!clear': {
    execute: clearQueue,
    description: 'Admin only - clear the current music queue'
  },*/
  '!prison': {
    execute: prison,
    description: 'Admin only - move a user to the prison for a certain amount of time'
  },
  '!release': {
    execute: release,
    description: 'Admin only - release a user from the prison'
  }
};

Bot.on('message', message => {
  WordService.registerMessage(message);

  if (isBotCommand(message)) {
    execute(message.content, message);
  }
});

function showSong(args, message) {
  Queue.showSong(message);
}

function voteSkip(args, message) {
  Queue.voteSkip(message);
}

function getQueueList(args, message) {
  Queue.getList(args, message);
}

function clearQueue(args, message) {
  Queue.clearQueue(message); 
}

function removeFromQueue(args, message) {
  if (Helper.admins.includes(message.member.user.id)) { 
    if (!Queue.isEmpty()) Queue.removeSong(args, message);
    else return message.reply(Helper.wrap('No songs in queue.'));
  }
  else return message.reply(Helper.wrap('You need to be an admin to remove a specific song.'));
}

function skraa(args, message) {
  if (soundEnabled) {
    doQueue("https://www.youtube.com/watch?v=zVrTEvwjdDY", message, false);
  }
  else message.reply(Helper.wrap('Music and sounds have been disabled, feggit. Please ask an admin to enable sound.'));
}

function whatislove(args, message) {
  if (soundEnabled) {
    doQueue("https://www.youtube.com/watch?v=W-1USI_uXho", message, false);
  }
  else message.reply(Helper.wrap('Music and sounds have been disabled, feggit. Please ask an admin to enable sound.'));
}

function gaaay(args, message) {
  if (soundEnabled) {
    doQueue("https://www.youtube.com/watch?v=YaG5SAw1n0c", message, false);
  }
  else message.reply(Helper.wrap('Music and sounds have been disabled, feggit. Please ask an admin to enable sound.'));
}  

function krakaka(args, message) {
  if (soundEnabled) {
    doQueue("https://www.youtube.com/watch?v=Gn1Cw_1x2tM", message, false);
  }
  else message.reply(Helper.wrap('Music and sounds have been disabled, feggit. Please ask an admin to enable sound.'));
}

function moeder(args, message) {
  if (soundEnabled) {
    doQueue("https://www.youtube.com/watch?v=DF4GPpm5hzE", message, false);
  }
  else message.reply(Helper.wrap('Music and sounds have been disabled, feggit. Please ask an admin to enable sound.'));
}

function nomoney(args, message) {
  if (soundEnabled) {
    doQueue("https://www.youtube.com/watch?v=uBHBA2DjCpA", message, false);
  }
  else message.reply(Helper.wrap('Music and sounds have been disabled, feggit. Please ask an admin to enable sound.'));
}

function gandalf(args, message) {
  if (soundEnabled) {
    doQueue("https://www.youtube.com/watch?v=yaHOvWMPeJA", message, false);
  }
  else message.reply(Helper.wrap('Music and sounds have been disabled, feggit. Please ask an admin to enable sound.'));  
}

function oceanman(args, message) {
  if (soundEnabled) {
    doQueue("https://www.youtube.com/watch?v=V5QodUp32oA", message, false);
  }
  else message.reply(Helper.wrap('Music and sounds have been disabled, feggit. Please ask an admin to enable sound.'));  
}

function rickroll(args, message) {
  var channel = Queue.getAuthorVoiceChannel(message);
  if (Queue.isEmpty() && soundEnabled && channel) {
    if (Helper.admins.includes(message.member.user.id)) { 
      doQueue("https://www.youtube.com/watch?v=PirBWXzL0Xs", message, false);
      return message.reply(Helper.wrap('Ofcourse sir, admin priviliges granted.')); 
    }
    doQueue("https://www.youtube.com/watch?v=PirBWXzL0Xs", message, false);
    message.reply(Helper.wrap('Nice try. You just got rick rolled, feggit!'));
  }
  else return message.reply(Helper.wrap('This command is currently unavailable. Please try again later or ask one of the admins fix this.'));
}

function personalQuote(args, message) {
  if (message.member.user.id == Helper.jh) { 
    return message.reply(Helper.wrap('Jasper is the most amazing person of the world <3 Please give him all your cookies')); 
  }
  if (message.member.user.id == Helper.rv) { 
    return message.reply(Helper.wrap('Ronnie is a feggit <3')); 
  }
  if (message.member.user.id == Helper.gv) { 
    var channel = Queue.getAuthorVoiceChannel(message);
    if (soundEnabled && channel) {
      if (Queue.isEmpty()) doQueue("https://www.youtube.com/watch?v=ZLZ89GBFxP8", message, false);
      else return message.reply(Helper.wrap('Sorry giel, you can only use this command when no song is playing.'));
    }
    else message.reply(Helper.wrap('Sorry giel, this command is currently unavailable.'));
    return;
  }
  if (message.member.user.id == Helper.tg) {
    return message.reply(Helper.wrap('Teun is secretly in love with juffrouw Ellen <3')); 
  }
  if (message.member.user.id == Helper.nve) {
    return message.reply(Helper.wrap('No cookies for you. All of your cookies just have been donated to the holy Jasper!')); 
  }
  return message.reply(Helper.wrap('Who the fuck are you?'));
}

function dumpertTop5(args, message) {
  Dumpert.getTop5(args, message);
}

function doQueueInfo(args, message) {
  if (soundEnabled) doQueue(args, message, true);
  else message.reply(Helper.wrap('Music and sounds have been disabled, feggit. Please ask an admin to enable sound.'));
}

function doQueue(args, message, info) {
  var prisonRole = message.guild.roles.find("name", "Prison");
  if (message.member.roles.has(prisonRole.id)) {
    return message.reply(Helper.wrap('You are in prison. You are not allowed to play music.'));
  }
    
  if (args.length <= 0) {
    return message.reply(Helper.wrap('Type of music need to be specified.'));
  }

  if (Queue.isFull()) {
    return message.reply(Helper.wrap('Queue is full.'));
  }

  if (args.startsWith('http')) {
    TrackHelper.getVideoFromUrl(args).then(track => {
      Queue.add(track, message, info);
    }).catch(err => {
      message.reply(Helper.wrap(err));
    });
  } else {
    TrackHelper.getFirstTrack(args, 1).then(track => {
      Queue.add(track, message, info);
    }).catch(err => {
      message.reply(Helper.wrap(err));
    });
  }
}

function blacklist(args, message) {
  if (args == "") {
    Queue.showBlacklist(message);
  }
  else {
    if (Helper.admins.includes(message.member.user.id)) {
      if (args.startsWith('http')) {
        TrackHelper.getVideoFromUrl(args).then(track => {
          Queue.addToBlacklist(track, message);
        }).catch(err => {
          message.reply(Helper.wrap(err));
        });
      } else {
        TrackHelper.getFirstTrack(args, 1).then(track => {
          Queue.addToBlacklist(track, message);
        }).catch(err => {
          message.reply(Helper.wrap(err));
        });
      }      
    }
    else message.reply(Helper.wrap('You need to be an admin to add a song to the blacklist, feggit.'));
  }
}

function whitelist(args, message) {
  if (Helper.admins.includes(message.member.user.id)) {
    var number = -1;
    if (isNormalInteger(args)) {
      number = args;
      Queue.removeFromBlacklist("", message, number);
    }
    else {
      if (args == "") {
        number = -2;
        Queue.removeFromBlacklist("", message, number);
      }
      else {
        if (args.startsWith('http')) {
          TrackHelper.getVideoFromUrl(args).then(track => {
            Queue.removeFromBlacklist(track, message, number);
          }).catch(err => {
            message.reply(Helper.wrap(err));
          });
        } else {
          TrackHelper.getFirstTrack(args, 1).then(track => {
            Queue.removeFromBlacklist(track, message, number);
          }).catch(err => {
            message.reply(Helper.wrap(err));
          });
        }
      }
    }
  }
  else message.reply(Helper.wrap('You need to be an admin to remove a song from the blacklist, feggit.'));
}

function doQueuePlaylist(args, message) {
  var user = message.author.username;
  var toReturn = "";
  if (args == "") {
    return message.reply(Helper.wrap('Please specify the playlist that you want to queue, feggit.\nCommand help: !queue.playlist [user(optional)] [playlist]'));
  }  
  else if (message.mentions.users.size === 0) {
    Github.readPlaylist(user, args, (userPlaylists,playlist,playlisturl) => {
      if (userPlaylists.includes(args)) {
        if (playlist[0] != "") {
          var amountOfSongs = 0;
          toReturn = "Your playlist '" + args + "' has been added to the queue:";
          for (var i = 0; i < playlist.length; i++) {
            addTrackUrlDelay(playlisturl[i], i, message);
            toReturn += "\n[" + (i + 1) + "]  " + playlist[i];
            amountOfSongs++;
            if (amountOfSongs == 30) {
              if (i < (playlist.length - 1)) {
                message.reply(Helper.wrap(toReturn));
                toReturn = '';
                amountOfSongs++;
              }
            }
          }
          toReturn += "\n\nUse the '!list' command to see the complete queue.";
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
      Github.readPlaylist(user, name, (userPlaylists,playlist,playlisturl) => {
        if (userPlaylists.includes(name)) {
          if (playlist[0] != "") {
            var amountOfSongs = 0;
            toReturn = user + "'s playlist '" + name + "' has been added to the queue:";
            for (var i = 0; i < playlist.length; i++) {
              addTrackUrlDelay(playlisturl[i], i, message);
              toReturn += "\n[" + (i + 1) + "]  " + playlist[i];
              amountOfSongs++;
              if (amountOfSongs == 30) {
                if (i < (playlist.length - 1)) {
                  message.reply(Helper.wrap(toReturn));
                  toReturn = '';
                  amountOfSongs = 0;
                }
              }
            }
            toReturn += "\n\nUse the '!list' command to see the complete queue.";
            message.reply(Helper.wrap(toReturn));
          }
          else message.reply(Helper.wrap(user + "'s playlist '" + name + "' is empty, feggit."));
        }
        else message.reply(Helper.wrap(user + " has no playlist with the name '" + name + "', feggit.\nCommand help: !queue.playlist [user(optional)] [playlist]"));
      });
    }
    else message.reply(Helper.wrap("Please specify which playlist you want to queue from '" + user  + "', feggit.\nCommand help: !queue.playlist [user(optional)] [playlist]"));
  }   
}

function addTrackUrlDelay(url, index, message) {
  setTimeout(() => {
    TrackHelper.getVideoFromUrl(url).then(track => {
      Queue.add(track, message, false);
    }).catch(err => {
      message.reply(Helper.wrap(err));
    });
  }, index * 1000); 
}

function doQueuePlaylistRandom(args, message) {
  var user = message.author.username;
  var toReturn = "";
  if (args == "") {
    return message.reply(Helper.wrap('Please specify the playlist that you want to queue, feggit.\nCommand help: !queue.playlist.random [user(optional)] [playlist]'));
  }  
  else if (message.mentions.users.size === 0) {
    Github.readPlaylist(user, args, (userPlaylists,playlist,playlisturl) => {
      if (userPlaylists.includes(args)) {
        if (playlist[0] != "") {
          var amountOfSongs = 0;
          toReturn = "Your playlist '" + args + "' has been added to the queue randomly:";
          for (var i = 0; i < playlist.length; i++) {
            TrackHelper.getVideoFromUrl(playlisturl[i]).then(track => {
              Queue.add(track, message, false);
            }).catch(err => {
              message.reply(Helper.wrap(err));
            });
            toReturn += "\n[" + (i + 1) + "]  " + playlist[i];
            amountOfSongs++;
            if (amountOfSongs == 30) {
              if (i < (playlist.length - 1)) {
                message.reply(Helper.wrap(toReturn));
                toReturn = '';
                amountOfSongs = 0;
              }
            }
          }
          toReturn += "\n\nUse the '!list' command to see the complete queue.";
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
      Github.readPlaylist(user, name, (userPlaylists,playlist,playlisturl) => {
        if (userPlaylists.includes(name)) {
          if (playlist[0] != "") {
            var amountOfSongs = 0;
            toReturn = user + "'s playlist '" + name + "' has been added to the queue randomly:";
            for (var i = 0; i < playlist.length; i++) {
              TrackHelper.getVideoFromUrl(playlisturl[i]).then(track => {
                Queue.add(track, message, false);
              }).catch(err => {
                message.reply(Helper.wrap(err));
              });
              toReturn += "\n[" + (i + 1) + "]  " + playlist[i];
              amountOfSongs++;
              if (amountOfSongs == 30) {
                if (i < (playlist.length - 1)) {
                  message.reply(Helper.wrap(toReturn));
                  toReturn = '';
                  amountOfSongs = 0;
                }
              }
            }
            toReturn += "\n\nUse the '!list' command to see the complete queue.";
            message.reply(Helper.wrap(toReturn));
          }
          else message.reply(Helper.wrap(user + "'s playlist '" + name + "' is empty, feggit."));
        }
        else message.reply(Helper.wrap(user + " has no playlist with the name '" + name + "', feggit.\nCommand help: !queue.playlist.random [user(optional)] [playlist]"));
      });
    }
    else message.reply(Helper.wrap("Please specify which playlist you want to queue from '" + user  + "', feggit.\nCommand help: !queue.playlist.random [user(optional)] [playlist]"));
  }   
}

function newPlaylist(args, message) {
  if (args == "") {
    return message.reply(Helper.wrap('Please give a name for the new playlist, feggit.\nCommand help: !playlist.new [name]'));
  }
  Playlist.newPlaylist(args, message);
}

function deletePlaylist(args, message) {
  if (args == "") {
    return message.reply(Helper.wrap('Please give the name of the playlist that you want to delete, feggit.\nCommand help: !playlist.delete [name]'));
  }
  Playlist.deletePlaylist(args, message);
}

function showPlaylist(args, message) {
  Playlist.showPlaylist(args, message);
}

function addPlaylist(args, message) {
  if (args == "") {
    return message.reply(Helper.wrap('You need to give the playlist and the song that you want to add to it, feggit.\nCommand help: !playlist.add [playlist] [song]'));
  }
  var data = args.split(" ");
  var list = data[0];
  data.shift();
  var song = "";
  for (var i = 0; i < data.length; i++) {
    song += data[i];
    if (i < (data.length - 1))
      song += " ";
  }
  if (song == "") {
    return message.reply(Helper.wrap('The song that you want to add to a playlist needs to be specified.\nCommand help: !playlist.add [playlist] [song]'));
  }
  if (song.startsWith('http')) {
    TrackHelper.getVideoFromUrl(song).then(track => {
      Playlist.addSong(list, track, message);
    }).catch(err => {
      message.reply(Helper.wrap(err));
    });
  } else {
    TrackHelper.getFirstTrack(song, 1).then(track => {
      Playlist.addSong(list, track, message);
    }).catch(err => {
      message.reply(Helper.wrap(err));
    });
  }  
}

function removePlaylist(args, message) {
  if (args == "") {
    return message.reply(Helper.wrap('You need to give the playlist and the song that you want to remove from it, feggit.\nCommand help: !playlist.remove [playlist] [song]'));
  }
  var data = args.split(" ");
  var list = data[0];
  data.shift();
  var song = "";
  for (var i = 0; i < data.length; i++) {
    song += data[i];
    if (i < (data.length - 1))
      song += " ";
  }
  if (song == "") {
    return message.reply(Helper.wrap('The song that you want to remove from a playlist needs to be specified.\nCommand help: !playlist.remove [playlist] [song]'));
  }
  if (song.startsWith('http')) {
    TrackHelper.getVideoFromUrl(song).then(track => {
      Playlist.removeSong(list, track, message);
    }).catch(err => {
      message.reply(Helper.wrap(err));
    });
  } else {
    TrackHelper.getFirstTrack(song, 1).then(track => {
      Playlist.removeSong(list, track, message);
    }).catch(err => {
      message.reply(Helper.wrap(err));
    });
  }  
}

function getVideo(args, message) {
  TrackHelper.getFirstTrack(args, 1).then(track => {
    message.reply(track.url);
  }).catch(err => {
    message.reply(Helper.wrap(err));
  });
}

function countWordsByUser(args, message) {
  WordService.countWordsByUser(args, message);
}

function getWeather(args, message) {
  WeatherService.getWeather(args, message);
}

function toggleSound (args, message) {
  if (Helper.admins.includes(message.member.user.id)) { 
    if (args == '-enable' || args == '-e') {
      soundEnabled = true;
      message.reply(Helper.wrap('Sounds enabled, sir.'));
    }
    else if (args == '-disable' || args == '-d') {
      soundEnabled = false;
      message.reply(Helper.wrap('Sounds disabled, sir.'));
    }
    else {
      soundEnabled = !soundEnabled;
      if (soundEnabled) message.reply(Helper.wrap('Sound enabled, sir.'));
      else message.reply(Helper.wrap('Sound disabled, sir.'));
    }
  }
  else message.reply(Helper.wrap('You need to be an admin to use this command, feggit.'));
}

function forwardQueue(args, message) {
  if (Helper.admins.includes(message.member.user.id)) {
    Queue.moveForward(args, message);
  }
  else message.reply(Helper.wrap('You need to be an admin to use this command, feggit.'));
}

function prison(args, message) {
  if (Helper.admins.includes(message.member.user.id)) {
    Prison.moveToPrison(args, message);
  }
  else message.reply(Helper.wrap('You need to be an admin to use this command, feggit.'));
}

function release(args, message) {
  if (Helper.admins.includes(message.member.user.id)) {
    Prison.releaseFromPrison(args, message);
  }
  else message.reply(Helper.wrap('You need to be an admin to use this command, feggit.'));
}

function showHelp(args, message) {
  var toReturn = 'No commands to run!';
  if (Object.keys(commands).length > 1) {
    var amountOfCommands = 0;
    var toReturn = 'Available commands:\n';
    for (var command in commands) {
      if (args == '-all' || args == '-a') {
        data = commands[command];
        toReturn += command + ': ' + data.description + getAvailableCommandAsText(data) + '\n';
        amountOfCommands++;
        if (amountOfCommands == 30 || amountOfCommands == 60 || amountOfCommands == 90) {
          message.reply(Helper.wrap(toReturn));
          toReturn = '';
        }
      }
      else {
        if (command != '!q' && command != '!help' && command != '!clear' && command != '!togglesound' && command != '!video' && command != '!queue' && command != '!playlist' && command != '!playlist.new' && command != '!playlist.delete' && command != '!playlist.add' && command != '!playlist.remove' && command != '!playlist.help' && command != '!pl' && command != '!pl.new' && command != '!pl.delete' && command != '!pl.add' && command != '!pl.remove' && command != '!queue.playlist' && command != '!q.pl' && command != '!pl.help' && command != '!voteskip' && command != '!song' && command != '!list' && command != '!forward' && command != '!remove' && command != '!blacklist' && command != '!whitelist' && command != '!prison' && command != '!release' && command != '!skraa' && command != '!whatislove' && command != '!gaaay' && command != '!krakaka' && command != '!moeder' && command != '!nomoney' && command != '!gandalf' && command != '!oceanman') {
          data = commands[command];
          toReturn += command + ': ' + data.description + getAvailableCommandAsText(data) + '\n';
        }        
      }
    }
  }
  message.reply(Helper.wrap(toReturn));
}

function showMusic(args, message) {
  var toReturn = 'No commands to run!';
  if (Object.keys(commands).length > 1) {
    var toReturn = 'Available music commands:\n';
    for (var command in commands) {
      if (args == '-all' || args == '-a') {
        if (command == '!queue' || command == '!q' || command == '!voteskip' || command == '!song' || command == '!list' || command == '!queue.playlist' || command == '!q.pl' || command == '!playlist.help' || command == '!pl.help' || command == '!clear' || command == '!forward' || command == '!remove' || command == '!blacklist' || command == '!whitelist') {
          data = commands[command];
          toReturn += command + ': ' + data.description + getAvailableCommandAsText(data) + '\n';
        }
      }
      else {
        if (command == '!queue' || command == '!voteskip' || command == '!song' || command == '!list' || command == '!queue.playlist' || command == '!playlist.help' || command == '!blacklist') {
          data = commands[command];
          toReturn += command + ': ' + data.description + getAvailableCommandAsText(data) + '\n';
        }
      }
    }
  }
  message.reply(Helper.wrap(toReturn));
}

function showSounds(args, message) {
  var toReturn = 'No commands to run!';
  if (Object.keys(commands).length > 1) {
    var toReturn = 'Available sound samples:\n';
    for (var command in commands) {
      if (command == '!skraa' || command == '!whatislove' || command == '!gaaay' || command == '!krakaka' || command == '!moeder' || command == '!nomoney' || command == '!gandalf' || command == '!oceanman') {
        data = commands[command];
        toReturn += command + ': ' + data.description + getAvailableCommandAsText(data) + '\n';
      }        
    }
  }
  message.reply(Helper.wrap(toReturn)); 
}

function helpPlaylist(args, message) {
  var toReturn = 'No commands to run!';
  if (Object.keys(commands).length > 1) {
    var toReturn = 'Available playlist commands:\n';
    for (var command in commands) {
      if (args == '-all' || args == '-a') {
        if (command == '!playlist' || command == '!playlist.new' || command == '!playlist.delete' || command == '!playlist.add' || command == '!playlist.remove' || command == '!queue.playlist' || command == '!playlist.help' || command == '!pl' || command == '!pl.new' || command == '!pl.delete' || command == '!pl.add' || command == '!pl.remove' || command == '!q.pl' || command == '!pl.help') {
          data = commands[command];
          toReturn += command + ': ' + data.description + getAvailableCommandAsText(data) + '\n';
        }
      }
      else {
        if (command == '!playlist' || command == '!playlist.new' || command == '!playlist.delete' || command == '!playlist.add' || command == '!playlist.remove' || command == '!queue.playlist') {
          data = commands[command];
          toReturn += command + ': ' + data.description + getAvailableCommandAsText(data) + '\n';
        }   
      }
    }
  }
  message.reply(Helper.wrap(toReturn)); 
}

function getAvailableCommandAsText(command) {
  if (!Helper.commandIsAvailable(command)) return ' (not available)';
  return '';
}

function roll(content, message) {
  message.reply(Helper.wrap('You rolled ' + getRandomNumber(1, 100) + ' (1-100)'));
}

function isBotCommand(message) {
  if (message.content.startsWith('!') && message.author.id != Bot.user.id) {
    return true;
  }
  return false;
}

function execute(content, message) {
  var args = content.split(" ");
  var command = commands[args[0].toLowerCase()];
  if (command) executeCommand(command, message, args);
}

function executeCommand(command, message, args) {
  if (!Helper.commandIsAvailable(command)) {
    return message.reply(Helper.wrap('Command is not available.'));
  }
  command.execute(getCommandArguments(args), message);
}

function getCommandArguments(args) {
  var withoutCommand = args.slice(1);
  return withoutCommand.join(" ");
}

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function registerService(service, affectedCommands) {
  service = new service();

  if (affectedCommands) {
    affectedCommands.forEach(command => {
      var c = commands[command];
      if (c) {
        if (!c.services) c.services = [];
        c.services.push(service);
      }
    });
  }
  return service;
}

function isNormalInteger(str) {
    var n = Math.floor(Number(str));
    return String(n) === str && n > 0;
}

function init() {
  Helper.keys('apikeys', ['discord']).then(keys => {
    Bot.login(keys.discord);
    Queue = registerService(Queue, ['!queue', '!q', '!queue.playlist', '!q.pl', '!voteskip', '!song', '!clear', '!admin', '!skraa', '!whatislove', '!gaaay', '!krakaka', '!moeder', '!nomoney', '!personal']);
    Playlist = registerService(Playlist, ['!playlist.new', '!playlist.delete', '!playlist', '!playlist.add', '!playlist.remove', '!pl.new', '!pl.delete', '!pl', '!pl.add', '!pl.remove']);
    TrackHelper = registerService(TrackHelper, ['!queue', '!q', '!queue.playlist', '!q.pl', '!video']);
    WordService = registerService(WordService, ['!words']);
    WeatherService = registerService(WeatherService, ['!weather']);
    Dumpert = registerService(Dumpert, ['!dumpert']);
    Prison = registerService(Prison, ['!prison', '!release']);
  }).catch(console.error);
}

init();
