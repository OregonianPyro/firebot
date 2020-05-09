module.exports.run = async (client, message, args) => {
    const weather = require('weather-js');
    const { MessageEmbed } = require('discord.js');
    if (!args[0]) return client.errors(message, 'param', 'LOCATION');
    const splitText = args.join(' ').split('--');
    const flag = splitText[1];
    if (!flag) return client.errors(message, 'param', 'CURRENT, LOCATION, FORECAST');
    if (!['current', 'location', 'forecast'].includes(flag.toLowerCase())) return client.errors(message, 'err', 'Invalid or missing flag.');
    weather.find({search: splitText[0].trim(), degreeType: 'F'}, function(err, result) {
        if (err) return client.errors(message, 'err', e.message);
        const res = JSON.stringify(result, null, 2);
        if (result.length < 1) return message.channel.send('Error: No results found.');
        switch (flag) {
            case 'current':{
                const embed = new MessageEmbed()
                    .setColor('BLUE')
                    .setAuthor(result[0].location.name, result[0].current.imageUrl)
                    .setDescription(`Here is the current weather for **${result[0].location.name}**`)
                    .addField('🌡️Temperature', result[0].current.temperature, true)
                    .addField('💦Humidity', result[0].current.humidity, true)
                    .addField('🌡️Feels Like', result[0].current.feelslike, true)
                    .addField('🌅Sky Conditions', result[0].current.skytext, true)
                    .addField('💨Wind Speed', result[0].current.winddisplay, true)
                    .addField('📆Date', result[0].current.date, true)
                    .addField('🗒️Observation', `\`\`\`Observed at the location '${result[0].current.observationpoint}' at ${result[0].current.observationtime}\`\`\``)
                return message.channel.send(embed);
            };
            case 'location':{
                const l = result[0].location;
                const embed = new MessageEmbed()
                    .setColor('BLUE')
                    .setThumbnail(l.imagerelativeurl)
                    .setDescription(`**Name:** ${l.name}\n**Latitude:**${l.lat}\n**Longitude:**${l.long}\n`)
                return message.channel.send(embed);
            };
            case 'forecast':{
                const embed = new MessageEmbed()
                    .setColor('BLUE')
                    .setAuthor(result[0].location.name, result[0].current.imageUrl)
                    .setDescription(`Here is the 5 day forecast for **${result[0].location.name}**`)
                const sandbox = result[0].forecast;
                for (let i in sandbox) {
                    embed.addField(`${sandbox[i].day}, ${sandbox[i].date}`, `🌡️**High:** ${sandbox[i].high}°\n🌡️>**Low:** ${sandbox[i].low}°\n🌅**Weather:** ${sandbox[i].skytextday}\n🌧️**Precipitation:** ${sandbox[i].precip}%`);
                };
                return message.channel.send(embed);
            };
        };
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
    name: 'weather',
    description: 'Retrieves weather data for a location.',
    usage: '$notes <@user|userID>',
    parameters: 'snowflakeGuildMember',
    aliases: [],
    cat: 'utility'
};