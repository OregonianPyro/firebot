module.exports.run = async (client, message, args) => {
    const { MessageEmbed } = require('discord.js');
    const settings = client.settings.get(message.guild.id);
    if (!message.member.permissions.has('KICK_MEMBERS')) return client.errors(message, 'perms', 'prune');
    if (!message.guild.me.permissions.has('DELETE_MESSAGES')) return client.errors(message, 'err', 'The bot requires the permission `DELETE_MESSAGES`.');
    if (!args[0] || isNaN(args[0])) return client.errors(message, 'param', 'NUMBER OF MESSAGES');
    const toClear = args[0];
    if (toClear > 100) return client.errors(message, 'err', 'You can only delete `100` messages at a time.');
    await message.delete();
    try {
        message.channel.bulkDelete(toClear);
    } catch (e) {
        return message.channel.send(`**:no_entry: Critical Error Occurred: ${e.message}**`);
    };
    const msg = await message.channel.send(`${client.emotes.check} Successfully pruned ${toClear} message(s)!`);
    client.setTimeout(() => {
        msg.delete();
    }, (10000));
    if (!settings.logging.modlog.enabled) return;
    let toSend = settings.logging.modlog.channel;
    if (!toSend || !message.guild.channels.cache.get(toSend)) return;
    toSend = message.guild.channels.cache.get(toSend);
    switch (settings.logging.modlog.type) {
        case 'text':{
            return toSend.send(`**Messages Pruned**\n# of Messages: ${args[0]}\nModerator: ${message.author.username}\nChannel: ${message.channel}`);
        };
        case 'embed':{
    const embed = new MessageEmbed()
        .setAuthor(message.author.tag, message.author.displayAvatarURL())
        .setTitle('Messages Pruned')
        .setDescription(`**${args[0]}** messages were pruned in <#${message.channel.id}>`)
        .addField('Action', 'Prune', true)
        .addField('# of Messages', args[0], true)
        .addField('Moderator', message.author.username, true)
        .setColor('BLUE')
        .setTimestamp()
return toSend.send(embed);
        };
    };
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