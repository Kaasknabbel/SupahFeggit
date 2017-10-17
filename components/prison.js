var Helper = require('./helper.js');

var exports = {};

module.exports = Prison = function() {
  var vm = this;
}

Prison.prototype.moveToPrison = function(args, message) {
  var argsArray = args.split(" ");
  console.log(argsArray);
  if (message.mentions.users.size === 0) 
    return message.reply(Helper.wrap('Please mention a user to move to the prison, sir.'));
  var prisonMember = message.guild.member(message.mentions.users.first());
  var amountOfTime = argsArray.slice(1).join(" ");
  if (amountOfTime) {
    if (!isNormalInteger(amountOfTime))
      return message.reply(Helper.wrap('Please mention a valid amount of time to kick ' + prisonMember.name + ', sir.'));
    return message.reply(Helper.wrap(prisonMember.name + ' has been moved to the prison for ' + amountOfTime + ' seconds, sir'));
  }
  else {
    return message.reply(Helper.wrap(prisonMember.name + ' has been moved to the prison for unlimited time, sir.'));
  }
}

Prison.prototype.releaseFromPrison = function(args, message) {
  
}

function isNormalInteger(str) {
  var n = Math.floor(Number(str));
  return String(n) === str && n > 0;
}
