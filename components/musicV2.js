const MusicAddon = require('discord.js-musicbot-addon');
const Helper = require('./helper.js');

var exports = {};

module.exports = Music = function() {
  var vm = this;
}

const music = new Music(client, {
  prefix: ".", // Prefix for the commands.
  global: true,            // Non-server-specific queues.
  maxQueueSize: 50,        // Maximum queue size of 25.
  clearInvoker: true,      // If permissions applicable, allow the bot to delete the messages that invoke it.
  helpCmd: 'mhelp',        // Sets the name for the help command.
  playCmd: 'music',        // Sets the name for the 'play' command.
  volumeCmd: 'adjust',     // Sets the name for the 'volume' command.
  leaveCmd: 'begone',      // Sets the name for the 'leave' command.
  disableLoop: true        // Disable the loop command.
});
