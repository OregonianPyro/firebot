module.exports.run = async (client, message, args) => {
    return message.channel.send('Ping!').then(m => {
        m.edit(`Pong! Latency is currently \`${m.createdTimestamp - message.createdTimestamp}\`ms`);
    });
};

module.exports.conf = {
    enabled: true,
    reason: null,
    permissions: {
        user: 'SEND_MESSAGES',
        bot: 'SEND_MESSAGES'
    }
};

module.exports.help = {
    name: 'ping',
    description: 'Displays the current latency from the bot to the Discord API.',
    usage: '{prefix}ping',
    parameters: 'None',
    aliases: [],
    extended: null,
    category: 'utility'
};