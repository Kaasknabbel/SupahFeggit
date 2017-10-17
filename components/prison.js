var Helper = require('./helper.js');

var exports = {};

module.exports = Prison = function() {
  var vm = this;
}

Prison.prototype.moveToPrison = function(args, message) {
  var argsArray = args.split(" ");
  console.log(argsArray);
  if (!args[0].mentions.users.first()) 
    return message.reply(Helper.wrap('Please mention a user to move to the prison, sir.'));
  if (args[1]) {
    if (!isNormalInteger(args[1]))
      return message.reply(Helper.wrap('Please mention a valid amount of time to kick ' + args[0].mentions.users.first() + ', sir.'));
  }
  else {
    return message.reply(Helper.wrap(args[0].mentions.users.first() + ' has been moved to the prison for unlimited time.'));
  }
}

Prison.prototype.releaseFromPrison = function(args, message) {
  
}

function isNormalInteger(str) {
  var n = Math.floor(Number(str));
  return String(n) === str && n > 0;
}
