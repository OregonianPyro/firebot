module.exports = (message, type, cmd) => {
    const { MessageEmbed } = require('discord.js');
    const client = message.client;
    const settings = message.client.settings.get(message.guild.id);
    switch (type) {
        case 'perm':{
            message.delete();
            const embed = new MessageEmbed()
                .setColor('RED')
                .setDescription(`${client.emotes.x} **Permissions Denied**\nThis command requires the \`${message.client.commands.get(cmd).conf.permissions.user}\` permission.`)
            return message.channel.send(embed);
        };
        case 'param':{
            message.delete();
            const embed = new MessageEmbed()
                .setColor('GOLD')
                .setDescription(`${client.emotes.warn} **Missing Parameter**\nInvalid or missing parameter '${cmd}'`)
            return message.channel.send(embed);
        };
        case 'err':{
            message.delete();
            const embed = new MessageEmbed()
                .setColor('RED')
                .setDescription(`${client.emotes.x} **Command Error**\n${cmd}`)
            return message.channel.send(embed);
        };
        case 'help':{
            const props = message.client.commands.get(cmd);
            message.delete();
            const embed = new MessageEmbed()
                .setColor('BLUE')
                .setAuthor(message.client.username, message.client.avatarURL())
                .setTitle(`Command Help: ${props.help.name}`)
                .setDescription(`**Name:** ${props.help.name}\nDescription:\`\`\`${props.help.description}\`\`\`\nUsage: ${props.help.name.replace('{prefix', settings.prefix)}\nAliases: ${props.help.aliases.length > 1 ? props.help.aliases.join(', ') : 'None'}`)
            return message.channel.send(embed);
        };
    };
};