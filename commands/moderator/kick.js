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
    if (member.roles.highest.rawPosition > message.member.roles.highest.rawPosition) return client.errors(message, 'err', 'You cannot moderate a user with a higher role than you.');
    if (member.user.id === message.author.id) return client.errors(message, 'err', 'You cannot moderate yourself.');
    if (settings.dmOnModeration.kick) {
        try {
            const embed = new MessageEmbed()
                .setColor('ORANGE')
                .setAuthor(message.guild.name, message.guild.iconURL())
                .setTitle('Kick Issued')
                .addField('Action', 'Kick', true)
                .addField('Moderator', message.author.username, true)
                .addField('Reason', reason, true)
            await member.send(`You have been kicked from ${message.guild.name}:`, embed);
        } catch (e) {
            console.log(e.message);
        };
    };
    try {
        await member.kick(`Kicked by ${message.author.tag}`);
    } catch (e) {
        return client.errors(message, 'err', e.message);
    };
    const embed = new MessageEmbed()
        .setColor('ORANGE')
        .setAuthor(message.author.username, message.author.avatarURL())
        .setDescription(`**${member.user.tag}** has been kicked by ${message.author.username}`)
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
        action: 'Kick',
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
            return toSend.send(`**New Moderation Action**\nCase #${counter}\nAction: Kick\nUser: ${member.user.tag} (\`${member.user.id}\`)\nModerator: ${message.author.tag}\nReason: **${reason}**`);
        };
        case 'embed':{
            const embed = new MessageEmbed()
                .setAuthor(member.user.tag, member.user.avatarURL())
                .setTitle('New Moderation Action')
                .setDescription(`Moderation happened at \`${date}\` in <#${message.channel.id}>\nReason:\`\`\`${reason}\`\`\``)
                .addField('Action', 'Kick', true)
                .addField('User ID', member.user.id, true)
                .addField('Moderator', message.author.username, true)
                .setColor('ORANGE')
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
    name: 'kick',
    description: 'Kicks a user from the server.',
    usage: '{prefix}kick <@user|user ID> <reason>',
    parameters: 'User, Reason',
    aliases: [],
    extended: null,
    category: 'moderator'
};