module.exports = async (client, channel) => {
    if (!['text', 'voice'].includes(channel.type)) return;
    const settings = client.settings.get(channel.guild.id);
    const moment = require('moment');
    const { MessageEmbed } = require('discord.js');
    if (!settings.logging.serverlog.enabled || !settings.logging.serverlog.channel) return;
    const logChannel = channel.guild.channels.cache.get(settings.logging.serverlog.channel);
    if (!logChannel) return;
    const type = channel.type === 'text' ? `${client.emotes.text} Text` : `${client.emotes.voice} Voice`;
    const time = moment().format('MMMM Do, YYYY, h:mm a');
    switch (settings.logging.serverlog.type) {
        case 'text':{
            let msg = [
                `**Channel Deleted**`,
                `Type: ${type}`,
                `Name: ${channel.name} (\`${channel.id}\`)`,
                `Parent: ${channel.parent.name} (\`${channel.parentID}\`)`,
                `Type: ${type}`,
                `Deleted At: ${time}`
            ];
            msg = msg.join('\n');
            return logChannel.send(msg);
        };
        case 'embed':{
            const audit = await channel.guild.fetchAuditLogs({ type: 'CHANNEL_DELETE' }).then(a => a.entries.first());
            const name = await channel.guild.fetchAuditLogs({ type: 'CHANNEL_DELETE' }).then(a => a.entries.first().changes[0].old)
            const embed = new MessageEmbed()
            .setColor('RED')
            .setAuthor(channel.guild.name, channel.guild.iconURL())
            .setTitle('Channel Deleted')
            .setDescription(`\`${audit.executor.username}#${audit.executor.discriminator}\` deleted a \`${channel.type}\` channel.`)
            .addField('Name', name, true)
            .addField('Type', channel.type === 'text' ? `${client.emotes.text}Text` : `${client.emotes.voice}Voice`, true)
            .addField('ID', audit.target.id, true)
            .setFooter(`${audit.executor.username}#${audit.executor.discriminator}`, audit.executor.displayAvatarURL())
            .setTimestamp();
        return logChannel.send(embed);
            // const embed = new MessageEmbed()
            //     .setColor('GREEN')
            //     .setAuthor(channel.guild.name, channel.guild.iconURL())
            //     .setDescription(`A new channel channel (<#${channel.id}>) has been created on **${time}**`)
            //     .addField('Name', channel.name, true)
            //     .addField('ID', channel.id, true)
            //     .addField('Type', type, true)
            //     .addField('Parent', channel.parent.name, true)
            //     .addField('Parent ID', channel.parentID, true)
            //     .addField('Position', channel.rawPosition, true)
            // return logChannel.send(embed);
        };
    };
};