module.exports.run = async (client, message, args) => {
    const { MessageEmbed } = require('discord.js');
    if (message.author.id !== '312358298667974656') return message.delete(), message.channel.send('**This command can only be ran by the bot developer.**');
    if (!args[0]) return;
    let flag;
    if (message.content.includes('--')) {
        flag = message.content.split('--')[1];
    } else { 
        flag = null 
    };
    if (flag === null) {
        const content = message.content.split(' ').slice(1).join(' ');
        const result = new Promise((resolve, reject) => resolve(eval(content)));
        return result.then(async output => {
            if (typeof output !== 'string') output = require('util').inspect(output, {
                depth: 0
            });
            let toolong = new MessageEmbed()
                .setColor("GOLD")
                .setTitle("Eval Success")
                .setDescription(`**Length too long, check console.**`)
            if (output.length > 1000) return console.log(output), message.channel.send(toolong);
            let success = new MessageEmbed()
                .setColor("GREEN")
                .addField(`**Eval Success**`, `\`\`\`${output}\`\`\``)
            return message.channel.send(success)
        }).catch(err => {
            console.error(err);
            err = err.toString();;
            let error = new MessageEmbed()
                .setColor("RED")
                .addField(`**Eval Fail**`, `\`\`\`${err}\`\`\``)
            return message.channel.send(error);
        });
    };
    if (flag.toLowerCase() === 'silent') {
        let content = message.content.split(' ').slice(1).join(' ').split('--')[0];
        const result = new Promise((resolve, reject) => resolve(eval(content)));
        return result.then(async output => {
            if (typeof output !== 'string') output = require('util').inspect(output, {
                depth: 0
            });
            let toolong = new MessageEmbed()
                .setColor("GOLD")
                .setTitle("Eval Success")
                .setDescription(`**Length too long, check console.**`)
            if (output.length > 1000) return console.log(output), message.channel.send(toolong);
            let success = new MessageEmbed()
                .setColor("GREEN")
                .addField(`**Eval Success**`, `\`\`\`${output}\`\`\``)
            await message.channel.send(success);
            return message.channel.bulkDelete(1);
        }).catch(err => {
            console.error(err);
            err = err.toString();
            let error = new MessageEmbed()
                .setColor("RED")
                .addField(` **Eval Fail**`, `\`\`\`${err}\`\`\``)
            return message.channel.send(error);
        });
        //silent
    };
};

module.exports.conf = {
    enabled: true,
    reason: null,
    permissions:{
        user:'SEND_MESSAGES',
        bot: 'EMBED_LINKS'
    }
};

module.exports.help = {
    name: "eval",
    description: "Evaluates JavaScript code.",
    usage: "$eval <code>",
    aliases: ['e'],
    parameters: 'stringCode',
    category: 'Dev-Only',
    extended: null
};