module.exports.run = async (client, message, args) => {
    const { MessageEmbed } = require('discord.js');
    const moment = require('moment');
    const settings = client.settings.get(message.guild.id) || client.defaultSettings;
    if (!message.member.permissions.has('KICK_MEMBERS')) return client.errors(message, 'perm', 'KICK_MEMBERS');
    if (!args[0]) return client.errors(message, 'param', 'CASE NUMBER');
    if (isNaN(args[0])) return client.errors(message, 'err', 'Case number provided was invalid (not a number).');
    if (!client.modCases.get(message.guild.id)[args[0]]) return client.errors(message, 'err', 'Unable to find that case number.');
    const modCase = client.modCases.get(message.guild.id);
    //const userCase = client.userModCases.get(member.user.id)[args[0]];
    modCase[args[0]].resolved = true;
    await client.modCases.set(message.guild.id, modCase);
    //userCases.resolved = true;
    //await client.userModCases.set(member.user.id, userCase);
    message.channel.send(`${client.emotes.check}Successfully resolved case #${args[0]}!`);
    if (!settings.logging.modlog.enabled || !settings.logging.modlog.channel) return;
    const modLogChannel = message.guild.channels.cache.get(settings.logging.modlog.channel);
    if (!modLogChannel) return;
    switch (settings.logging.modlog.type) {
        case 'text':{
            const msg = await modLogChannel.messages.cache.filter(m => m.content.toLowerCase().includes(`case #: ${args[0]}`));
            console.log(msg);
            const content = msg.content;
            await msg.edit(`${msg.content}\n**${client.emotes.check}RESOLVED**`)
        };
        case 'embed':{
            
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