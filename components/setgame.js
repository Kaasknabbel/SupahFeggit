var Helper = require('./helper.js');

var exports = {};

module.exports = Game = function() {
  var vm = this;
}

Game.prototype.setGame = function(args, message) {
  var vm = this;
  var argsArray = args.split(" ");
  if (message.mentions.users.size === 0) 
    return message.reply(Helper.wrap('Please mention a user (or bot), sir.'));
  var gameMember = message.guild.member(message.mentions.users.first());
  var gameName = argsArray.slice(1).join(" ");
  if (gameName == "")
    return message.reply(Helper.wrap("Please mention what game '" + gameMember.user.username + "' should be playing, sir."));
  gameMember.user.setGame(gameName);
  return message.reply(Helper.wrap("The current game of '" + gameMember.user.username + "' has been set to '" + gameName + "', sir."));
}
