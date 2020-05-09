module.exports.run = async (client, message, args) => {
    const { MessageEmbed } = require('discord.js');
    const settings = client.settings.get(message.guild.id);
    const success = (toggle, cmd) => {
        const embed = new MessageEmbed()
            .setColor('GREEN')
            .setAuthor(message.guild.name, message.guild.iconURL())
            .setDescription(`${client.emotes.check}Successfully ${toggle}d the command **${cmd}**`)
        return message.channel.send(embed);
    };
    if (!message.member.permissions.has('ADMINISTRATOR')) return client.errors(message, 'perms', 'command');
    let flag = args[0];
    if (!flag) return client.errors(message, 'param', 'ENABLE, VIEW, DISABLE');
    flag = flag.toLowerCase();
    if (!['view', 'enable', 'disable'].includes(flag)) return client.errors(message, 'err', 'Invalid flag provided.');
    switch(flag) {
        case 'disable':{
            let command = args[1];
            if (!command) return client.errors(message, 'param', 'COMMAND NAME');
            command = command.toLowerCase();
            if (!client.commands.has(command) && !client.aliases.has(command)) return client.errors(message, 'err', 'Invalid command (the bot does not have this command).');
            if (!settings.disabledCommands.includes(command)) return client.errors(message, 'err', `The command '${command}' is already disabled.`);
            await message.delete();
            settings.disabledCommands.push(command);
            client.settings.set(message.guild.id, settings);
            return success('enable', command);
        };
        case 'view':{

        };
        case 'enable':{
            let command = args[1];
            if (!command) return client.errors(message, 'param', 'COMMAND NAME');
            command = command.toLowerCase();
            if (!client.commands.has(command) && !client.aliases.has(command)) return client.errors(message, 'err', 'Invalid command (the bot does not have this command).');
            if (!settings.disabledCommands.includes(command)) return client.errors(message, 'err', `The command '${command}' is not disabled.`);
            await message.delete();
            const index = settings.disabledCommands.indexOf(command);
            settings.disabledCommands.splice(index, 1);
            client.settings.set(message.guild.id, settings);
            return success('disable', command);
        };
    };
};

module.exports.conf = {
    enabled: true,
    reason: null,
    permissions: {
        user: 'ADMINISTRATOR',
        bot: 'EMBED_LINKS'
    }
};

module.exports.help = {
    name: 'command',
    description: 'Enable / disable commands for the server.',
    usage: '{prefix}command <enable|view|disable> <commandName>',
    parameters: 'Flag, Command Name (only for `enable`, `disable`)',
    aliases: ['cmd'],
    extended: null,
    category: 'admin'
};