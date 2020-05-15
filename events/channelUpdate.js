module.exports = async (client, oldChannel, newChannel) => {
    if (!oldChannel.guild || !newChannel.guild) return;
    const settings = client.settings.get(oldChannel.guild.id);
    const moment = require('moment');
    const { MessageEmbed } = require('discord.js');
    if (!settings.logging.serverlog.enabled || !settings.logging.serverlog.channel) return;
    const logChannel = channel.guild.channels.cache.get(settings.logging.serverlog.channel);
    if (!logChannel) return;
    const time = moment().format('MMMM Do, YYYY, h:mm a');
    let type;
    oldChannel.name === newChannel.name ? 'type' : 'name';
    switch (type) {
        case 'type':{
            const newType = `${oldChannel.type} -> ${newChannel.type}`;
            switch (settings.logging.serverlog.type) {
                case 'text':{
                    return logChannel.send(`**Channel Update**\nUpdate: Type\nChange: ${newType}\nDate: ${time}`);
                };
                case 'embed':{
                    
                    const embed = new MessageEmbed()
                        .setColor('GOLD')
                        .setAuthor(newChannel.guild.name, newChannel.guild.iconURL())
                };
            };
        };
        case 'name':{
            switch (settings.logging.serverlog.type) {
                case 'text':{

                };
                case 'embed':{

                };
            };
        };
    };
};