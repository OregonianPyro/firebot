module.exports = async (client, message) => {
    const { MessageEmbed } = require('discord.js');
    if (message.author.bot) return;
    if (!client.settings.has(message.guild.id)) client.settings.set(message.guild.id, require('../default_settings.js'));
    const settings = client.settings.get(message.guild.id);
    if (message.content.indexOf(settings.prefix) !== 0) return;
    const args = message.content.split(' ').slice(1);
    let command = message.content.split(' ')[0];
    command = command.slice(settings.prefix.length).toLowerCase();
    if (client.commands.has(command)) {
        const cmd = client.commands.get(command);
        if (!cmd.conf.enabled) {
            message.delete();
            const embed = new MessageEmbed()
                .setColor('RED')
                .setAuthor(client.user.username, client.user.avatarURL())
                .setTitle('Command Disabled')
                .setDescription(`The command '**${cmd.help.name.toLowerCase()}**' has been disabled by the bot developer.`)
                .addField('Reason', cmd.conf.reason)
            return message.channel.send(embed);
        }
        cmd.run(client, message, args);
    } else if (client.aliases.has(command)) {
        const cmd = client.aliases.get(command);
        if (!cmd.conf.enabled) {
            message.delete();
            const embed = new MessageEmbed()
                .setColor('RED')
                .setAuthor(client.user.username, client.user.avatarURL())
                .setTitle('Command Disabled')
                .setDescription(`The command '**${cmd.help.name.toLowerCase()}**' has been disabled by the bot developer.`)
                .addField('Reason', cmd.conf.reason)
            return message.channel.send(embed);
        }
        cmd.run(client, message, args);
    };
};