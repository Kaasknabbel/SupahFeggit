var Helper = require('./helper.js');

var exports = {};

module.exports = Queue = function() {
  var vm = this;

  vm.skipVotes = [];
  vm.queue = [];
  vm.currentDispatcher = undefined;

  Helper.keys('queue', ['maxlen', 'skipmajority']).then(values => {
    vm.maxlen = values.maxlen;
    vm.skipmajority = values.skipmajority;
  }).catch(err => {
    console.log(err);
    vm.hasUnmetDepedencies = true;
  });
}

Queue.prototype.add = function(track, message, info) {
  this.queue.push(track);

  if (info) message.reply(Helper.wrap('Added ' + track.title + ' to the queue. (number ' + (this.queue.indexOf(track) + 1) + ')'));

  if (this.queue.length == 1) {
    this.play(message, info);
  }
}

Queue.prototype.isFull = function() {
  return this.queue.length >= this.maxlen;
}

Queue.prototype.isEmpty = function() {
  return this.queue.length == 0;
}

Queue.prototype.getList = function(args, message) {
  var vm = this;
  if (vm.queue.length > 0) {
    var toReturn = 'Current queue:\n';
    for (var song = 0; song < vm.queue.length; song++) {
      toReturn += '[' + (song + 1) + ']  ' + vm.queue[song].title + '\n';
    }
    return message.reply(Helper.wrap(toReturn));
  }
  else return message.reply(Helper.wrap('No songs in queue.'));
}

Queue.prototype.play = function(message, info) {
  var vm = this;
  var channel = vm.getAuthorVoiceChannel(message);

  if (!channel) {
    vm.queue = [];
    return message.reply(Helper.wrap('You are not in a voice channel.'));
  }

  var toPlay = vm.queue[0];
  if (!toPlay) {
    if (info) return message.reply(Helper.wrap('No songs in queue.'));
  }

  channel.join().then(connection => {
    var stream = toPlay.stream();

    vm.currentDispatcher = connection.playStream(stream, {
      seek: 0,
      volume: 0.2
    }, error => {
      console.log(error);
    });

    vm.currentDispatcher.on('end', event => {
      if(vm.isEmpty()) connection.disconnect();
      vm.remove(message, info);
    });

    vm.currentDispatcher.on('error', err => {
      connection.disconnect();
      message.channel.sendMessage(Helper.wrap('An error occured while playing the song.'));
      vm.remove(message, info);
    });

    vm.skipVotes = [];
    if (info) message.channel.sendMessage(Helper.wrap('Now playing: ' + toPlay.title));
  }).catch(console.error);
}

Queue.prototype.showSong = function(message) {
  var song = this.queue[0];

  if (song) {
    return message.reply(Helper.wrap('Now playing: ' + song.title + '\n' + song.url));
  } else {
    return message.reply(Helper.wrap('No song is currently playing.'));
  }
}

Queue.prototype.voteSkip = function(message) {
  var vm = this;
  var channel = vm.getAuthorVoiceChannel(message);

  if (!vm.currentDispatcher) {
    return message.reply(Helper.wrap('No song is currently playing.'));
  }

  if (Helper.admins.includes(message.member.user.id)) {
    this.currentDispatcher.end();
    return message.reply(Helper.wrap('Of course sir.'));
  }

  if (!channel) {
    return message.reply(Helper.wrap("You are not allowed to voteskip since you're not in the channel."));
  }

  if (vm.skipVotes.indexOf(message.author.id) > -1) {
    return message.reply(Helper.wrap('You have already voted to skip this song.'));
  }

  vm.skipVotes.push(message.author.id);

  var totalMembers = Helper.getTotalMembers(channel);

  if (vm.skipVotes.length / totalMembers >= vm.skipmajority) {
    this.currentDispatcher.end();
  } else {
    var votesNeeded = getAmountOfVotesNeeded(totalMembers, vm.skipVotes.length, vm.skipmajority);
    return message.reply(Helper.wrap('You need ' + votesNeeded + ' more vote(s) to skip this song.'));
  }
}

Queue.prototype.moveForward = function(args, message) {
  var vm = this;
  if (args = "") {
    var song = vm.queue.length - 1;
    var toReturn = vm.queue[song].title + ' will be the next song played in the queue.';
    vm.queue.splice(1,0,song);
    return message.reply(Helper.wrap(toReturn));
  }
  else {
    if (isNormalInteger(args)) {
      if (args <= vm.queue.length) {
        var song = args - 1;
        var toReturn = vm.queue[song].title + ' will be the next song played in the queue.';  
        vm.queue.splice(1, 0, song);
        return message.reply(Helper.wrap(toReturn));
      }
      else {
        var song = vm.queue.length - 1;
        var toReturn = vm.queue[song].title + ' will be the next song played in the queue.';
        vm.queue.splice(1,0,song);
        return message.reply(Helper.wrap(toReturn));  
      }
    }
    else return message.reply(Helper.wrap('Argument is not a positive integer. Please give the correct queue number of the song to remove it.'));
  }    
  }
}

Queue.prototype.remove = function(message, info) {
  var vm = this;
  vm.queue.shift();
  if (vm.queue.length > 0) {
    vm.play(message, info);
  } else {
    if (info) message.channel.sendMessage(Helper.wrap('No more songs in queue.'));
  }
}

Queue.prototype.removeSong = function(args, message) {
  var vm = this;
  if (args == "") {
    var song = vm.queue.length - 1;
    var toReturn = 'Song has been removed from the queue:\n[' + (song + 1) + ']  ' + vm.queue[song].title + '\n';
    vm.queue.pop();
    if (song == 0) vm.currentDispatcher.end();
    return message.reply(Helper.wrap(toReturn));
  }
  else {
    if (isNormalInteger(args)) {
      if (args <= vm.queue.length) {
        var song = args - 1;
        var toReturn = 'Song has been removed from the queue:\n[' + (song + 1) + ']  ' + vm.queue[song].title + '\n';  
        vm.queue.splice(song, 1);
        if (song == 0) vm.currentDispatcher.end();
        return message.reply(Helper.wrap(toReturn));
      }
      else {
        var song = vm.queue.length - 1;
        var toReturn = 'Song has been removed from the queue:\n[' + (song + 1) + ']  ' + vm.queue[song].title + '\n';
        vm.queue.pop();
        if (song == 0) vm.currentDispatcher.end();
        return message.reply(Helper.wrap(toReturn));        
      }
    }
    else return message.reply(Helper.wrap('Argument is not a positive integer. Please give the correct queue number of the song to remove it.'));
  }
}

Queue.prototype.clearQueue = function(message) {
   var vm = this;
   if (Helper.admins.includes(message.member.user.id)) {
     vm.queue = [];
     if (vm.currentDispatcher) {
       vm.currentDispatcher.end();  
     }
     return message.reply(Helper.wrap('Of course sir.'));
  }
  else return message.reply(Helper.wrap('Only admins can clear the queue.'));
}

Queue.prototype.getAuthorVoiceChannel = function(message) {
  var voiceChannelArray = message.guild.channels.filter((v) => v.type == 'voice').filter((v) => v.members.exists('id', message.author.id)).array();
  if(voiceChannelArray.length <= 0) {
    return undefined;
  }
  return voiceChannelArray[0];
}


function getAmountOfVotesNeeded(members, skipVotes, skipMajority) {
  var needed = 0;
  var skips = skipVotes;
  for (var i = 0; i < members; i++) {
    if (skips / members < skipMajority) {
      skips++;
      needed++;
    }
  }
  return needed;
}

function isNormalInteger(str) {
    var n = Math.floor(Number(str));
    return String(n) === str && n > 0;
}
