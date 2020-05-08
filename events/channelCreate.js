module.exports = async (client, channel) => {
    const settings = client.settings.get(channel.guild.id);
    const moment = require('moment');
    const { MessageEmbed } = require('discord.js');
    if (!settings.logging.serverlog.enabled || !settings.logging.serverlog.channel) return;
    const logChannel = channel.guild.channels.cache.get(settings.logging.serverlog.channel);
    if (!logChannel) return;
    const type = channel.type === 'text' ? `${client.emotes.text} Text` : `${client.emotes.voice} Voice`;
    const time = moment(channel.createdTimestamp).format('MMMM Do, YYYY, h:mm a');
    switch (settings.logging.serverlog.type) {
        case 'text':{
            let msg = [
                `**New Channel Created**`,
                `Type: ${type}`,
                `Name: ${channel.name} (\`${channel.id}\`)`,
                `Parent: ${channel.parent.name} (\`${channel.parentID}\`)`,
                `Type: ${type}`,
                `Position: ${channel.rawPosition}`,
                `Created At: ${time}`
            ];
            msg = msg.join('\n');
            return logChannel.send(msg);
        };
        case 'embed':{
            const tagChannel = () => {
                if (channel.type === 'text') return `<#${channel.id}>`;
                else return 'voice'
            };
            const audit = await channel.guild.fetchAuditLogs({ type: 'CHANNEL_CREATE' }).then(a => a.entries.first());
            const description = `\`${audit.executor.username}#${audit.executor.discriminator}\` created the \`${tagChannel}\` channel `
            const embed = new MessageEmbed()
            .setColor('GREEN')
            .setAuthor(channel.guild.name, channel.guild.iconURL())
            .setTitle('Channel Created')
            .setDescription(`\`${audit.executor.username}#${audit.executor.discriminator}\` created the \`${audit.target.type}\` channel `)
            .addField('Name', audit.target.name, true)
            .addField('Type', audit.target.type === 'text' ? `${client.emotes.text}Text` : `${client.emotes.voice}Voice`, true)
            .addField('ID', audit.target.id, true)
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