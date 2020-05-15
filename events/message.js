module.exports = async (client, message) => {
    const { MessageEmbed } = require('discord.js');
    if (message.author.bot) return;
    message.settings = client.settings.get(message.guild.id) || client.defaultSettings;
    if (!client.settings.has(message.guild.id)) client.settings.set(message.guild.id, require('../default_settings.js'));
    const settings = client.settings.get(message.guild.id);
    if (message.attachments.size > 0) {
        if (!settings.logging.imagelog.enabled || !settings.logging.imagelog.channel) return;
        const channel = message.guild.channels.cache.get(settings.logging.imagelog.channel);
        if (!channel) return;
        switch (settings.logging.imagelog.type) {
            case 'text':{
                const sandbox = [];
                const imgs = message.attachments.array();
                for (let i in imgs) {
                    sandbox.push(`**${message.author.tag}** (\`${message.author.id}\`) posted an image in ${message.channel}\nName: ${imgs[i].name}\nID: ${imgs[i].id}\nURL: ${imgs[i].url}`);
                };
                for (let i in sandbox) {
                    channel.send(sandbox[i]);
                };
            };
            case 'embed':{
                const sandbox = [];
                const imgs = message.attachments.array();
                const imgSize = `${message.attachments.size} ` + message.attachments.size > 1 ? 'images' : 'image';
                for (let i in imgs) {
                    const embed = new MessageEmbed()
                        .setColor('BLUE')
                        .setAuthor(message.author.username, message.author.displayAvatarURL())
                        .setTitle('Image Logging')
                        .setDescription(`${message.member} posted an image in ${message.channel}`)
                        .setThumbnail(imgs[i].url)
                        .addField('Name', imgs[i].name, true)
                        .addField('URL', imgs[i].url, true)
                        .setTimestamp()
                    channel.send(embed);
                };
            };
        };
    };
    if (message.content.indexOf(settings.prefix) !== 0) return;
    const args = message.content.split(' ').slice(1);
    let command = message.content.split(' ')[0];
    command = command.slice(settings.prefix.length).toLowerCase();
    if (client.commands.has(command)) {
        const cmd = client.commands.get(command);
        if (settings.disabledCommands.includes(cmd)) {
            //if (message.member.permissions.has('ADMINISTRATOR')) return cmd.run(client, message, args); 
            const embed = new MessageEmbed()
                .setColor('RED')
                .setTitle('Command Disabled')
                .setDescription(`The command **${cmd}** has been disabled for this server.`);
            return message.channel.send(embed);
        };
        // if (!cmd.conf.enabled) {
        //     message.delete();
        //     const embed = new MessageEmbed()
        //         .setColor('RED')
        //         .setAuthor(client.user.username, client.user.avatarURL())
        //         .setTitle('Command Disabled')
        //         .setDescription(`The command '**${cmd.help.name.toLowerCase()}**' has been disabled by the bot developer.`)
        //         .addField('Reason', cmd.conf.reason)
        //     return message.channel.send(embed);
        // }
        cmd.run(client, message, args);
    } else if (client.aliases.has(command)) {
        const cmd = client.aliases.get(command);
        if (settings.disabledCommands.includes(cmd)) {
            if (message.member.permissions.has('ADMINISTRATOR')) return cmd.run(client, message, args); 
            const embed = new MessageEmbed()
                .setColor('RED')
                .setTitle('Command Disabled')
                .setDescription(`The command **${cmd}** has been disabled for this server.`);
            return message.channel.send(embed);
        };
        // if (!cmd.conf.enabled) { 
        //     message.delete();
        //     const embed = new MessageEmbed()
        //         .setColor('RED')
        //         .setAuthor(client.user.username, client.user.avatarURL())
        //         .setTitle('Command Disabled')
        //         .setDescription(`The command '**${cmd.help.name.toLowerCase()}**' has been disabled by the bot developer.`)
        //         .addField('Reason', cmd.conf.reason)
        //     return message.channel.send(embed);
        // }
        cmd.run(client, message, args);
    };
};