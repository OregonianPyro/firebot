module.exports.run = async (client, message, args) => {
    const moment = require('moment');
    const { prefix } = client.settings.get(message.guild.id);
    const { MessageEmbed } = require('discord.js');
    if (!args[0]) {
        const invites = await message.guild.fetchInvites();
        if (invites.size < 1) return message.channel.send(`${message.member} | This server has no invites.`);
        const embed = new MessageEmbed()
            .setColor('BLUE')
            .setAuthor(message.guild.name, message.guild.iconURL())
            .setDescription(`Successfully found **${invites.size}** invites.`)
            .setFooter(`To get detailed information on a specific invite, run ${prefix}invite --c <code>`)
        invites.forEach(inv => {
            embed.addField('Code', inv.code, true)
            embed.addField('Inviter', inv.inviter.tag, true)
            embed.addField('Created On',moment(inv.createdTimestamp).format('MMMM Do YYYY, h:mm a'), true)
        });
        return message.channel.send(embed);
    };
    let flag = args[0].toLowerCase();
    if (['--all', 'all', '--delete', 'delete'].includes(flag)) {

    };
    if (message.mentions.members.size > 0 || message.guild.members.cache.get(flag)) {

    };
    if (message.mentions.channels.size > 0 || message.guild.channels.cache.get(flag)) {

    };
};

module.exports.conf = {
    enabled: true,
    reason: null,
    permissions: {
        user: 'SEND_MESSAGES',
        bot: 'EMBED_LINKS'
    }
};

module.exports.help = {
    name: 'invite',
    description: 'View invites for the server, or for a specific user / channel. Staff can also delete an invite through this command.',
    usage: '{prefix}invite [--all|@user|user ID|#channel|channel ID|--delete <code>]',
    parameters: 'Optional: --All, User, Channel, Delete',
    aliases: ['inv'],
    extended: null,
    category: 'utility'
};