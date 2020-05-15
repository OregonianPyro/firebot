module.exports.run = async (client, message, args) => {
    const { MessageEmbed } = require('discord.js');
    const moment = require('moment');
    const settings = client.settings.get(message.guild.id) || client.defaultSettings;
    if (!message.member.permissions.has('KICK_MEMBERS')) return client.errors(message, 'perm', 'KICK_MEMBERS');
    if (!args[0]) return client.errors(message, 'param', 'CASE NUMBER');
    if (isNaN(args[0])) return client.errors(message, 'err', 'Case number provided was invalid (not a number).');
    if (!client.modCases.get(message.guild.id)[args[0]]) return client.errors(message, 'err', 'Unable to find that case number.');
    const modCase = client.modCases.get(message.guild.id);
    if (modCase[args[0]].resolved === true) return client.errors(message, 'err', 'This moderation case has already been marked as resolved.');
    modCase[args[0]].resolved = true;
    await client.modCases.set(message.guild.id, modCase);
    message.channel.send(`${client.emotes.check}Successfully resolved case #${args[0]}!`);
    if (!settings.logging.modlog.enabled || !settings.logging.modlog.channel) return;
    const modLogChannel = message.guild.channels.cache.get(settings.logging.modlog.channel);
    if (!modLogChannel) return;
    switch (settings.logging.modlog.type) {
        case 'text':{
            let modLogCase;
            modLogChannel.messages.fetch({ limit: 100 }).then(msgs => {
                const sandbox = [];
                msgs.forEach(msg => {
                    if (msg.content.includes(`Case #: ${args[0]}`)) sandbox.push(msg.id);
                });
                modLogCase = sandbox[0];
                modLogChannel.messages.fetch(modLogCase).then(m => {
                    const member = m.content.split('`')[1];
                    const userCase = client.userModCases.get(member)[args[0]];
                    userCase[args[0]].resolved = true;
                    client.userModCases.set(member, modCase);
                    m.edit(`${m.content}\n${client.emotes.check}Resolved`);
                });
            });
        };
        case 'embed':{
            let modLogCase;
            modLogChannel.messages.fetch({ limit: 100 }).then(msgs => {
                const sandbox = [];
                msgs.forEach(msg => {
                    if (msg.embeds.length < 0) return;
                    if (msg.embeds.length >= 0 &&
                        msg.embeds[0] &&
                        msg.author.id === client.user.id &&
                        msg.embeds[0].footer &&
                        msg.embeds[0].footer.text.length > 0 &&
                        msg.embeds[0].footer.text === `Case #${args[0]}`) {
                            return sandbox.push(msg.id);
                    };
                });
                modLogCase = sandbox[0];
                modLogChannel.messages.fetch(modLogCase).then(m => {
                    const member = m.embeds[0].fields[1].value;
                    // const userCase = client.userModCases.get(member)[args[0]];
                    // userCase[args[0]-1].resolved = true;
                    // client.userModCases.set(member, modCase);
                    const newEmbed = new MessageEmbed()
                        .setColor(m.embeds[0].hexColor)
                        .setAuthor(m.embeds[0].author.name, m.embeds[0].author.iconURL)
                        .setTitle(m.embeds[0].title)
                        .setDescription(m.embeds[0].description)
                        .addField(m.embeds[0].fields[0].name, m.embeds[0].fields[0].value, true)
                        .addField(m.embeds[0].fields[1].name, m.embeds[0].fields[1].value, true)
                        .addField(m.embeds[0].fields[2].name, m.embeds[0].fields[2].value, true)
                        .setFooter(m.embeds[0].footer.text)
                        .setTimestamp(m.embeds[0].timestamp)
                    return m.edit(`${client.emotes.check}Case has been resolved by **${message.author.username}**`, newEmbed)
                });
            });
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