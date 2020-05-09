module.exports.run = async (client, message, args) => {
    const { MessageEmbed } = require('discord.js');
    const moment = require('moment');
    const settings = client.settings.get(message.guild.id) || client.defaultSettings;
    if (!message.member.permissions.has('KICK_MEMBERS')) return client.errors(message, 'perm', 'mute');
    if (!args[0]) return client.errors(message, 'param', 'USER MENTION OR ID');
    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if (!member) return client.errors(message, 'err', 'Unable to find that member.');
    const reason = args.slice(1).join(' ');
    if (!reason) return client.errors(message, 'param', 'REASON');
    if (!settings.roles.muted || !message.guild.roles.cache.get(settings.roles.muted)) return client.errors(message, 'err', 'Invalid or no muted role set.');
    const role = message.guild.roles.cache.get(settings.roles.muted);
    if (role.rawPosition > message.guild.me.roles.highest.rawPosition) return client.errors(message, 'err', 'Muted role is higher than the bot and cannot be assigned.');
    if (member.roles.highest.rawPosition > message.member.roles.highest.rawPosition) return client.errors(message, 'err', 'You cannot moderate a user with a higher role than you.');
    if (member.user.id === message.author.id) return client.errors(message, 'err', 'You cannot moderate yourself.');
    if (member.roles.cache.has(role.id)) return client.errors(message, 'err', 'That user is already muted.');
    if (settings.dmOnModeration.mute) {
        try {
            const embed = new MessageEmbed()
                .setColor('#a3a3a3')
                .setAuthor(message.guild.name, message.guild.iconURL())
                .setTitle('Mute Issued')
                .addField('Action', 'Mute', true)
                .addField('Moderator', message.author.username, true)
                .addField('Reason', reason, true)
            await member.send(`You have been moderated in ${message.guild.name}:`, embed);
        } catch (e) {
            console.log(e.message);
        };
    };
    try {
        await member.roles.add(role.id, `Muted by ${message.author.tag}`);
    } catch (e) {
        return client.errors(message, 'err', e.message);
    };
    const embed = new MessageEmbed()
        .setColor('#a3a3a3')
        .setAuthor(message.author.username, message.author.avatarURL())
        .setDescription(`**${member.user.tag}** has been muted by ${message.author.username}`)
        .addField('Reason', reason)
    await message.channel.send(member.user, embed);
    //Database stuffs
    if (!client.modCases.has(message.guild.id)) client.modCases.set(message.guild.id, []);
    let counter = client.modCases.get(message.guild.id);
    counter = counter.length;
    const date = moment().format('MMMM Do, YYYY hh:mm A');
    const obj = {
        caseNum: counter,
        user: member.user.tag,
        moderator: message.author.username,
        action: 'Mute',
        reason: reason,
        time: null,
        resolved: false,
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
            return toSend.send(`**New Moderation Action**\nCase #: ${counter}\nAction: Muting\nUser: ${member.user.tag} (\`${member.user.id}\`)\nModerator: ${message.author.tag}\nReason: **${reason}**`);
        };
        case 'embed':{
            const embed = new MessageEmbed()
                .setAuthor(member.user.tag, member.user.avatarURL())
                .setTitle('New Moderation Action')
                .setDescription(`Moderation happened at \`${date}\` in <#${message.channel.id}>\nReason:\`\`\`${reason}\`\`\``)
                .addField('Action', 'Muting', true)
                .addField('User ID', member.user.id, true)
                .addField('Moderator', message.author.username, true)
                .setColor('#a3a3a3')
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
    name: 'mute',
    description: 'Mutes a user until a moderator unmutes them.',
    usage: '{prefix}mute <@user|user ID> <reason>',
    parameters: 'User, Reason',
    aliases: [],
    extended: null,
    category: 'moderator'
};