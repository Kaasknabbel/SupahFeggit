var Helper = require('./helper.js');

var exports = {};

module.exports = Prison = function() {
  var vm = this;
}

Prison.prototype.moveToPrison = function(args, message) {
  var vm = this;
  var argsArray = args.split(" ");
  if (message.mentions.users.size === 0) 
    return message.reply(Helper.wrap('Please mention a user to move to the prison, sir.'));
  var prisonMember = message.guild.member(message.mentions.users.first());
  var prisonRole = message.guild.roles.find("name", "Prison");
  if (prisonMember.roles.has(prisonRole.id))
    return message.reply(Helper.wrap(prisonMember + ' is already in prison, sir.'));
  var prisonerChannel = checkVoicePrisoner(message, prisonMember);
  var prisonChannel = message.guild.channels.filter(g => {
    return g.type == 'voice' && g.name == 'Gevangenis';
  }).first();
  var amountOfTime = argsArray.slice(1).join(" ");
  if (amountOfTime) {
    if (!isNormalInteger(amountOfTime))
      return message.reply(Helper.wrap('Please mention a valid amount of time to imprison the user, sir.'));
    setTimeout(() => {
      vm.releaseFromPrison(args, message);
    }, amountOfTime * 1000);
    prisonMember.addRole(prisonRole).catch(console.error);
    if (prisonerChannel) {
      message.guild.member(prisonMember).setVoiceChannel(prisonChannel);
    }
    return message.reply(Helper.wrap(prisonMember + ' has been moved to the prison for ' + amountOfTime + ' seconds, sir.'));
  }
  else {
    prisonMember.addRole(prisonRole).catch(console.error);
    if (prisonerChannel) {
      message.guild.member(prisonMember).setVoiceChannel(prisonChannel);
    }
    return message.reply(Helper.wrap(prisonMember + ' has been moved to the prison for unlimited time, sir.'));
  }
}

Prison.prototype.releaseFromPrison = function(args, message) {
  var vm = this;
  if (message.mentions.users.size === 0) 
    return message.reply(Helper.wrap('Please mention a user to release from the prison, sir.'));
  var prisonMember = message.guild.member(message.mentions.users.first());
  var prisonRole = message.guild.roles.find("name", "Prison");
  if (prisonMember.roles.has(prisonRole.id)) {
    prisonMember.removeRole(prisonRole).catch(console.error);
    return message.reply(Helper.wrap(prisonMember + ' has been released from the prison, sir.'));
  }
  else return message.reply(Helper.wrap(prisonMember + ' is currently not imprisoned, sir.'));
}

function checkVoicePrisoner(message, prisonMember) {
  var voiceChannelArray = message.guild.channels.filter((v) => v.type == 'voice').filter((v) => v.members.exists('id', prisonMember.id)).array();
  if(voiceChannelArray.length <= 0) {
    return undefined;
  }
  return voiceChannelArray[0];
}

function isNormalInteger(str) {
  var n = Math.floor(Number(str));
  return String(n) === str && n > 0;
}
