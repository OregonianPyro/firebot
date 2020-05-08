module.exports.run = async (client, message, args) => {
    const { MessageEmbed } = require('discord.js');
    const moment = require('moment');
    const settings = client.settings.get(message.guild.id) || client.defaultSettings;
    if (!message.member.permissions.has('KICK_MEMBERS')) return client.errors(message, 'perm', 'KICK_MEMBERS');
    if (!args[0]) return client.errors(message, 'param', 'USER MENTION OR ID');
    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if (!member) return client.errors(message, 'err', 'Unable to find that member.');
    const reason = args.slice(1).join(' ');
    if (!reason) return client.errors(message, 'param', 'REASON');
    if (settings.dmOnModeration.warn) {
        try {
            const embed = new MessageEmbed()
                .setColor('GOLD')
                .setAuthor(message.guild.name, message.guild.iconURL())
                .setTitle('Warning Issued')
                .addField('Action', 'Warning', true)
                .addField('Moderator', message.author.username, true)
                .addField('Reason', reason, true)
            await member.send(`You have been moderated in ${message.guild.name}:`, embed);
        } catch (e) {
            console.log(e.message);
        };
    };  
    const embed = new MessageEmbed()
        .setColor('GOLD')
        .setAuthor(message.author.username, message.author.avatarURL())
        .setDescription(`**${member.user.tag}** has been given a warning by ${message.author.username}`)
        .addField('Reason', reason)
    await message.channel.send(member.user, embed);
    //Database stuffs
    if (!client.modCases.has(message.guild.id)) client.modCases.set(message.guild.id, []);
    let counter = client.modCases.get(message.guild.id);
    counter = counter.length;
    const date = moment().format('MMMM Do, YYYY hh:mm A');
    const obj = {
        caseNum: counter,
        user: member.user.id,
        moderator: message.author.username,
        action: 'warning',
        reason: reason,
        time: null,
        date: date
    };
    const curCasesGuild = client.modCases.get(message.guild.id);
    curCasesGuild.push(obj);
    await client.modCases.set(message.guild.id, curCasesGuild);
    if (!client.userModCases.has(member.user.id)) client.userModCases.set(member.user.id, []);
    const curCasesUser = client.userModCases.get(member.user.id);
    curCasesUser.push(obj);
    await client.userModCases.set(member.user.id, curCasesUser);
    //Logging stuffs
    if (!settings.logging.modlog.enabled) return;
    let toSend = settings.logging.modlog.channel;
    if (!toSend || !message.guild.channels.cache.get(toSend)) return;
    toSend = message.guild.channels.cache.get(toSend);
    switch (settings.logging.modlog.type) {
        case 'text':{
            return toSend.send(`**New Moderation Action**\nCase #: ${counter}\nAction: Warning\nUser: ${member.user.tag} (\`${member.user.id}\`)\nModerator: ${message.author.tag}\nReason: **${reason}**`);
        };
        case 'embed':{
            const embed = new MessageEmbed()
                .setAuthor(member.user.tag, member.user.avatarURL())
                .setTitle('New Moderation Action')
                .setDescription(`Moderation happened at \`${date}\` in <#${message.channel.id}>\nReason:\`\`\`${reason}\`\`\``)
                .addField('Action', 'Warning', true)
                .addField('User ID', member.user.id, true)
                .addField('Moderator', message.author.username, true)
                .setColor('GOLD')
                .setFooter(`Case #${counter}`)
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
    name: 'warn',
    description: 'Issues a warning to a user.',
    usage: '{prefix}warn <@user|user ID> <reason>',
    parameters: 'User, Reason',
    aliases: [],
    extended: null,
    category: 'moderator'
};