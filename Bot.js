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
    execute: showHelp
  },
  '!words': {
    execute: countWordsByUser,
    description: 'Get the most popular words for user of the given username, defaults to your username'
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
  '!skraa': {
    execute: skraa,
    description: 'THE THING GOES SKRAA!'
  },
  '!whatislove': {
    execute: whatislove,
    description: 'What is love?'
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
  '!clear': {
    execute: clearQueue
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

function clearQueue(args, message) {
  Queue.clearQueue(message); 
}

function skraa(args, message) {
  if (Queue.isEmpty()) doQueue("https://www.youtube.com/watch?v=zVrTEvwjdDY", message, false);
  else return message.reply(Helper.wrap('This command is only allowed when no song is playing.'));
}

function whatislove(args, message) {
  if (Queue.isEmpty()) doQueue("https://www.youtube.com/watch?v=W-1USI_uXho", message, false);
  else return message.reply(Helper.wrap('This command is only allowed when no song is playing.'));
}

function rickroll(args, message) {
  if (message.member.user.id == jh) { 
    return message.reply(Helper.wrap('Ofcourse sir, admin priviliges granted.')); 
  }
  if (Queue.isEmpty()) {
    doQueue("https://www.youtube.com/watch?v=PirBWXzL0Xs", message, false);
    message.reply(Helper.wrap('Nice try. You just got rick rolled, feggit!'));
  }
  else return message.reply(Helper.wrap('Bot is currently in use. Please try again when bot is done with its current task.'));
}

function personalQuote(args, message) {
  if (message.member.user.id == jh) { 
    return message.reply(Helper.wrap('Jasper is the most amazing person of the world <3 Please give him all your cookies')); 
  }
  if (message.member.user.id == rv) { 
    return message.reply(Helper.wrap('Ronnie is a feggit <3')); 
  }
  if (message.member.user.id == gv) { 
     if (Queue.isEmpty()) doQueue("https://www.youtube.com/watch?v=ZLZ89GBFxP8", message, false);
     else return message.reply(Helper.wrap('Sorry giel, you can only use this command when no song is playing.'));
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
  //Dumpert.getTop5(args, message);
  return message.reply(Helper.wrap('Dumpert executed.'));
}

function doQueueInfo(args, message) {
  doQueue(args, message, true);
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
    TrackHelper.getRandomTrack(args, 5).then(track => {
      Queue.add(track, message, info);
    }).catch(err => {
      message.reply(Helper.wrap(err));
    });
  }
}

function getVideo(args, message) {
  TrackHelper.getRandomTrack(args, 5).then(track => {
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

function showHelp(args, message) {
  var toReturn = 'No commands to run!';
  if (Object.keys(commands).length > 1) {
    var toReturn = 'Available commands:\n';
    for (var command in commands) {
      if (command != '!help' && command != '!clear') {
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

    Queue = registerService(Queue, ['!queue', '!voteskip', '!song']);
    TrackHelper = registerService(TrackHelper, ['!queue', '!video']);
    WordService = registerService(WordService, ['!words']);
    WeatherService = registerService(WeatherService, ['!weather']);
    Dumpert = registerService(Dumpert, ['!dumpert']);
  }).catch(console.error);
}

init();
