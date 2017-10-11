var Discord = require('discord.js');
var Bot = new Discord.Client();
var Helper = require('./components/helper.js');
var Queue = require('./components/queue.js');
var TrackHelper = require('./components/trackhelper.js');
var WordService = require('./components/wordservice.js');
var WeatherService = require('./components/weatherservice.js');
var Dumpert = require('./components/dumpert.js');

var jh = '235065709011533826';
var rv = '199234428709502976';
var gv = '260387356761260033';
var tg = '226669570629435392';
var nve = '160357117721706496';
var admins = [jh, rv];

var soundEnabled = true;

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
  '!music': {
    execute: showMusic,
    description: 'Get a list of available music commands'
  },
  '!queue': {
    execute: doQueueInfo,
    description: 'Queue your song'
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
  '!remove': {
    execute: removeFromQueue,
    description: 'Admin only - remove a specific song from the queue'
  },
  '!leave': {
    execute: leaveChannel,
    description: 'Admin only - remove bot from the voicechannel'
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
  '!togglesound': {
    execute: toggleSound,
    description: 'Admin only - enable or disable bot sound/music commands'
  },
  '!clear': {
    execute: clearQueue,
    description: 'Admin only - clear the current music queue'
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
  if (admins.includes(message.member.user.id)) { 
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

function rickroll(args, message) {
  var channel = Queue.getAuthorVoiceChannel(message);
  if (Queue.isEmpty() && soundEnabled && channel) {
    if (admins.includes(message.member.user.id)) { 
      doQueue("https://www.youtube.com/watch?v=PirBWXzL0Xs", message, false);
      return message.reply(Helper.wrap('Ofcourse sir, admin priviliges granted.')); 
    }
    doQueue("https://www.youtube.com/watch?v=PirBWXzL0Xs", message, false);
    message.reply(Helper.wrap('Nice try. You just got rick rolled, feggit!'));
  }
  else return message.reply(Helper.wrap('This command is currently unavailable. Please try again later or ask one of the admins fix this.'));
}

function personalQuote(args, message) {
  if (message.member.user.id == jh) { 
    return message.reply(Helper.wrap('Jasper is the most amazing person of the world <3 Please give him all your cookies')); 
  }
  if (message.member.user.id == rv) { 
    return message.reply(Helper.wrap('Ronnie is a feggit <3')); 
  }
  if (message.member.user.id == gv) { 
    var channel = Queue.getAuthorVoiceChannel(message);
    if (soundEnabled && channel) {
      if (Queue.isEmpty()) doQueue("https://www.youtube.com/watch?v=ZLZ89GBFxP8", message, false);
      else return message.reply(Helper.wrap('Sorry giel, you can only use this command when no song is playing.'));
    }
    else message.reply(Helper.wrap('Sorry giel, this command is currently unavailable.'));
    return;
  }
  if (message.member.user.id == tg) {
    return message.reply(Helper.wrap('Teun is secretly in love with juffrouw Ellen <3')); 
  }
  if (message.member.user.id == nve) {
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

function leaveChannel(args, message) {
  if (admins.includes(message.member.user.id)) { 
    Queue.leaveVoicechannel(args, message);
  }
  else return message.reply(Helper.wrap('You need to be an admin to use this command, feggit.'));
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
  if (admins.includes(message.member.user.id)) { 
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

function showHelp(args, message) {
  var toReturn = 'No commands to run!';
  if (Object.keys(commands).length > 1) {
    var toReturn = 'Available commands:\n';
    for (var command in commands) {
      if (args == '-all' || args == '-a') {
        data = commands[command];
        toReturn += command + ': ' + data.description + getAvailableCommandAsText(data) + '\n';
      }
      else {
        if (command != '!help' && command != '!clear' && command != '!togglesound' && command != '!video' && command != '!queue' && command != '!voteskip' && command != '!song' && command != '!list' && command != '!remove' && command != '!skraa' && command != '!whatislove' && command != '!gaaay' && command != '!krakaka' && command != '!moeder' && command != '!nomoney') {
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
        if (command == '!queue' || command == '!voteskip' || command == '!song' || command == '!list' || command == '!clear' || command == '!remove') {
          data = commands[command];
          toReturn += command + ': ' + data.description + getAvailableCommandAsText(data) + '\n';
        }
      }
      else {
        if (command == '!queue' || command == '!voteskip' || command == '!song' || command == '!list') {
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
      if (command == '!skraa' || command == '!whatislove' || command == '!gaaay' || command == '!krakaka' || command == '!moeder' || command == '!nomoney') {
        data = commands[command];
        toReturn += command + ': ' + data.description + getAvailableCommandAsText(data) + '\n';
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

function init() {
  Helper.keys('apikeys', ['discord']).then(keys => {
    Bot.login(keys.discord);
    Queue = registerService(Queue, ['!queue', '!voteskip', '!song', '!clear', '!admin', '!skraa', '!whatislove', '!gaaay', '!krakaka', '!moeder', '!nomoney', '!personal']);
    TrackHelper = registerService(TrackHelper, ['!queue', '!video']);
    WordService = registerService(WordService, ['!words']);
    WeatherService = registerService(WeatherService, ['!weather']);
    Dumpert = registerService(Dumpert, ['!dumpert']);
  }).catch(console.error);
}

init();
