module.exports.run = async (client, message, args) => {
    const { MessageEmbed } = require('discord.js');
    const moment = require('moment');
    const settings = client.settings.get(message.guild.id) || client.defaultSettings;
    if (!message.member.permissions.has('KICK_MEMBERS')) return client.errors(message, 'perm', 'KICK_MEMBERS');
    if (!args[0]) return client.errors(message, 'param', 'CASE NUMBER');
    if (isNaN(args[0])) return client.errors(message, 'err', 'Case number provided was invalid (not a number).');
    const caseNum = client.modCases.get(message.guild.id)[args[0]];
    if (!caseNum) return client.errors(message, 'err', 'Unable to find that case number.');
    const embed = new MessageEmbed()
        .setColor('BLUE')
        .setAuthor(message.author.username, message.author.avatarURL())
        .setDescription(`Successfully fetched moderation data for case #${args[0]}!`)
        .addField('User', caseNum.user, true)
        .addField('Moderator', caseNum.moderator, true)
        .addField('Action', caseNum.action, true)
        .addField('Reason', `\`\`\`${caseNum.reason}\`\`\``)
        .addField('Status', caseNum.resolved ? `${client.emotes.check}Resolved` : `${client.emotes.warn}Active`, true)
    if (caseNum.time) embed.addField('Length', caseNum.time, true);
    embed.setFooter(`Occurred On: ${caseNum.date} PDT`)
    return message.channel.send(embed);
};

module.exports.conf = {
    enabled: true,
    reason: null,
    permissions: {
        user: 'KICK_MEMBERS',
        bot: 'EMBED_LINKS'
    }
};

module.exports.help = {
    name: 'case',
    description: 'Retrieves information on a moderation case.',
    usage: '{prefix}case <case#>',
    parameters: 'Case#',
    aliases: [],
    extended: null,
    category: 'moderator'
};