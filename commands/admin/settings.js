module.exports.run = async (client, message, args) => {
    const { MessageEmbed } = require('discord.js');
    const settings = client.settings.get(message.guild.id);
    if (!message.member.permissions.has('ADMINISTRATOR')) {
        message.delete();
        return message.channel.send(`:no_entry: **This command requires you to have the permission \`ADMINISTRATOR\``);
    };
    if (!args[0]) {
        message.delete();
        return message.channel.send(`:no_entry: Invalid usage. Run \`${settings.prefix}help settings\` for help.`);
    };
    const success = (key, val) => {
        const embed = new MessageEmbed()
            .setColor('GREEN')
            .setTitle('Settings Updated Successfully')
            .setDescription(`${client.emotes.check} Successfully set your ${key} to ${val}`)
        message.channel.send(embed)
    };
    const key = args[0].toLowerCase();
    const sandbox = [
        'modlog',
        'msglog',
        'nicklog',
        'imglog',
        'rolelog',
        'memberlog',
        'serverlog',
        'prefix',
        'roles',
        'greeting',
        'goodbye'
    ];
    if (!sandbox.includes(key)) return client.errors(message, 'param', 'KEY');
    switch (key) {
        case 'prefix':{
            const val = args[1];
            if (!val) return client.errors(message, 'param', 'NEW PREFIX');
            if (val.length > 10) return client.errors(message, 'err', 'Prefixes cannot be longer than 10 characters.');
            settings.prefix = val;
            client.settings.set(message.guild.id, settings);
            return success('prefix', args[1]);
        };
        case 'modlog':{
            let key2 = args[1];
            if (!key2) return client.errors(message, 'param', 'TOGGLE, SET');
            if (!['toggle', 'set', 'type'].includes(key2.toLowerCase())) return client.errors(message, 'err', 'Key must be `toggle`, `set`, or `type`.');
            switch (key2.toLowerCase()) {
                case 'toggle':{
                    if (settings.logging.modlog.enabled) {
                        settings.logging.modlog.enabled = false;
                        client.settings.set(message.guild.id, settings);
                        return success('moderation logging', 'disabled');
                    } else if (!settings.logging.modlog.enabled) {
                        settings.logging.modlog.enabled = true;
                        client.settings.set(message.guild.id, settings);
                        return success('moderation logging', 'enabled');
                    };
                };
                case 'set':{
                    let channel = args[2];
                    if (!channel) return client.errors(message, 'param', 'CHANNEL MENTION OR ID');
                    channel = message.mentions.channels.first() || message.guild.channels.cache.get(channel);
                    if (!channel) return client.errors(message, 'err', 'Unable to find that channel.');
                    channel = channel.id;
                    settings.logging.modlog.channel = channel;
                        client.settings.set(message.guild.id, settings);
                        return success('moderation logging channel', `<#${channel}>`);
                };
                case 'type':{
                    let type = args[2];
                    if (!type) return client.errors(message, 'param', 'EMBED OR TEXT');
                    if (!['embed', 'text'].includes(type.toLowerCase())) return client.errors(message, 'param', 'EMBED, TEXT');
                    type = args[2].toLowerCase();
                    settings.logging.modlog.type = type;
                        client.settings.set(message.guild.id, settings);
                        return success('moderation logging type', type);
                };
            };
        };
        case 'nicklog':{
            let key2 = args[1];
            if (!key2) return client.errors(message, 'param', 'TOGGLE, SET');
            if (!['toggle', 'set', 'type'].includes(key2.toLowerCase())) return client.errors(message, 'err', 'Key must be `toggle`, `set`, or `type`.');
            switch (key2.toLowerCase()) {
                case 'toggle':{
                    if (settings.logging.nicklog.enabled) {
                        settings.logging.nicklog.enabled = false;
                        client.settings.set(message.guild.id, settings);
                        return success('nickname logging', 'disabled');
                    } else if (!settings.logging.nicklog.enabled) {
                        settings.logging.nicklog.enabled = true;
                        client.settings.set(message.guild.id, settings);
                        return success('nickname logging', 'enabled');
                    };
                };
                case 'set':{
                    let channel = args[2];
                    if (!channel) return client.errors(message, 'param', 'CHANNEL MENTION OR ID');
                    channel = message.mentions.channels.first() || message.guild.channels.cache.get(channel);
                    if (!channel) return client.errors(message, 'err', 'Unable to find that channel.');
                    channel = channel.id;
                    settings.logging.nicklog.channel = channel;
                        client.settings.set(message.guild.id, settings);
                        return success('nickname logging channel', `<#${channel}>`);
                };
                case 'type':{
                    let type = args[2];
                    if (!type) return client.errors(message, 'param', 'EMBED OR TEXT');
                    if (!['embed', 'text'].includes(type.toLowerCase())) return client.errors(message, 'param', 'EMBED, TEXT');
                    type = args[2].toLowerCase();
                    settings.logging.nicklog.type = type;
                        client.settings.set(message.guild.id, settings);
                        return success('nickname logging type', type);
                };
            };
            
        };
        case 'rolelog':{
            let key2 = args[1];
            if (!key2) return client.errors(message, 'param', 'TOGGLE, SET, TYPE');
            if (!['toggle', 'set', 'type'].includes(key2.toLowerCase())) return client.errors(message, 'err', 'Key must be `toggle`, `set`, or `type`.');
            switch (key2.toLowerCase()) {
                case 'toggle':{
                    if (settings.logging.rolelog.enabled) {
                        settings.logging.rolelog.enabled = false;
                        client.settings.set(message.guild.id, settings);
                        return success('role logging', 'disabled');
                    } else if (!settings.logging.rolelog.enabled) {
                        settings.logging.rolelog.enabled = true;
                        client.settings.set(message.guild.id, settings);
                        return success('role logging', 'enabled');
                    };
                };
                case 'set':{
                    let channel = args[2];
                    if (!channel) return client.errors(message, 'param', 'CHANNEL MENTION OR ID');
                    channel = message.mentions.channels.first() || message.guild.channels.cache.get(channel);
                    if (!channel) return client.errors(message, 'err', 'Unable to find that channel.');
                    channel = channel.id;
                    settings.logging.rolelog.channel = channel;
                        client.settings.set(message.guild.id, settings);
                        return success('role logging channel', `<#${channel}>`);
                };
                case 'type':{
                    let type = args[2];
                    if (!type) return client.errors(message, 'param', 'EMBED OR TEXT');
                    if (!['embed', 'text'].includes(type.toLowerCase())) return client.errors(message, 'param', 'EMBED, TEXT');
                    type = args[2].toLowerCase();
                    settings.logging.rolelog.type = type;
                        client.settings.set(message.guild.id, settings);
                        return success('role logging type', type);
                };
            };
        };
        case 'serverlog':{
            let key2 = args[1];
            if (!key2) return client.errors(message, 'param', 'TOGGLE, SET, TYPE');
            if (!['toggle', 'set', 'type'].includes(key2.toLowerCase())) return client.errors(message, 'err', 'Key must be `toggle`, `set`, or `type`.');
            switch (key2.toLowerCase()) {
                case 'toggle':{
                    if (settings.logging.serverlog.enabled) {
                        settings.logging.serverlog.enabled = false;
                        client.settings.set(message.guild.id, settings);
                        return success('server logging', 'disabled');
                    } else if (!settings.logging.serverlog.enabled) {
                        settings.logging.serverlog.enabled = true;
                        client.settings.set(message.guild.id, settings);
                        return success('server logging', 'enabled');
                    };
                };
                case 'set':{
                    let channel = args[2];
                    if (!channel) return client.errors(message, 'param', 'CHANNEL MENTION OR ID');
                    channel = message.mentions.channels.first() || message.guild.channels.cache.get(channel);
                    if (!channel) return client.errors(message, 'err', 'Unable to find that channel.');
                    channel = channel.id;
                    settings.logging.serverlog.channel = channel;
                        client.settings.set(message.guild.id, settings);
                        return success('server logging channel', `<#${channel}>`);
                };
                case 'type':{
                    let type = args[2];
                    if (!type) return client.errors(message, 'param', 'EMBED OR TEXT');
                    if (!['embed', 'text'].includes(type.toLowerCase())) return client.errors(message, 'param', 'EMBED, TEXT');
                    type = args[2].toLowerCase();
                    settings.logging.serverlog.type = type;
                        client.settings.set(message.guild.id, settings);
                        return success('server logging type', type);
                };
            };
        };
        case 'imglog':{
            let key2 = args[1];
            if (!key2) return client.errors(message, 'param', 'TOGGLE, SET, TYPE');
            if (!['toggle', 'set', 'type'].includes(key2.toLowerCase())) return client.errors(message, 'err', 'Key must be `toggle`, `set`, or `type`.');
            switch (key2.toLowerCase()) {
                case 'toggle':{
                    if (settings.logging.imagelog.enabled) {
                        settings.logging.imagelog.enabled = false;
                        client.settings.set(message.guild.id, settings);
                        return success('image logging', 'disabled');
                    } else if (!settings.logging.imagelog.enabled) {
                        settings.logging.imagelog.enabled = true;
                        client.settings.set(message.guild.id, settings);
                        return success('image logging', 'enabled');
                    };
                };
                case 'set':{
                    let channel = args[2];
                    if (!channel) return client.errors(message, 'param', 'CHANNEL MENTION OR ID');
                    channel = message.mentions.channels.first() || message.guild.channels.cache.get(channel);
                    if (!channel) return client.errors(message, 'err', 'Unable to find that channel.');
                    channel = channel.id;
                    settings.logging.imagelog.channel = channel;
                        client.settings.set(message.guild.id, settings);
                        return success('image logging channel', `<#${channel}>`);
                };
                case 'type':{
                    let type = args[2];
                    if (!type) return client.errors(message, 'param', 'EMBED OR TEXT');
                    if (!['embed', 'text'].includes(type.toLowerCase())) return client.errors(message, 'param', 'EMBED, TEXT');
                    type = args[2].toLowerCase();
                    settings.logging.imagelog.type = type;
                        client.settings.set(message.guild.id, settings);
                        return success('image logging type', type);
                };
            };
        };
        case 'usernamelog':{
            let key2 = args[1];
            if (!key2) return client.errors(message, 'param', 'TOGGLE, SET, TYPE');
            if (!['toggle', 'set', 'type'].includes(key2.toLowerCase())) return client.errors(message, 'err', 'Key must be `toggle`, `set`, or `type`.');
            switch (key2.toLowerCase()) {
                case 'toggle':{
                    if (settings.logging.usernameLog.enabled) {
                        settings.logging.usernameLog.enabled = false;
                        client.settings.set(message.guild.id, settings);
                        return success('username logging', 'disabled');
                    } else if (!settings.logging.usernameLog.enabled) {
                        settings.logging.usernameLog.enabled = true;
                        client.settings.set(message.guild.id, settings);
                        return success('username logging', 'enabled');
                    };
                };
                case 'set':{
                    let channel = args[2];
                    if (!channel) return client.errors(message, 'param', 'CHANNEL MENTION OR ID');
                    channel = message.mentions.channels.first() || message.guild.channels.cache.get(channel);
                    if (!channel) return client.errors(message, 'err', 'Unable to find that channel.');
                    channel = channel.id;
                    settings.logging.usernameLog.channel = channel;
                        client.settings.set(message.guild.id, settings);
                        return success('username logging channel', `<#${channel}>`);
                };
                case 'type':{
                    let type = args[2];
                    if (!type) return client.errors(message, 'param', 'EMBED OR TEXT');
                    if (!['embed', 'text'].includes(type.toLowerCase())) return client.errors(message, 'param', 'EMBED, TEXT');
                    type = args[2].toLowerCase();
                    settings.logging.usernameLog.type = type;
                        client.settings.set(message.guild.id, settings);
                        return success('username logging type', type);
                };
            };
        };
        case 'msglog':{
            let key2 = args[1];
            if (!key2) return client.errors(message, 'param', 'TOGGLE, SET, TYPE');
            if (!['toggle', 'set', 'type'].includes(key2.toLowerCase())) return client.errors(message, 'err', 'Key must be `toggle`, `set`, or `type`.');
            switch (key2.toLowerCase()) {
                case 'toggle':{
                    if (settings.logging.msglog.enabled) {
                        settings.logging.msglog.enabled = false;
                        client.settings.set(message.guild.id, settings);
                        return success('message logging', 'disabled');
                    } else if (!settings.logging.msglog.enabled) {
                        settings.logging.msglog.enabled = true;
                        client.settings.set(message.guild.id, settings);
                        return success('message logging', 'enabled');
                    };
                };
                case 'set':{
                    let channel = args[2];
                    if (!channel) return client.errors(message, 'param', 'CHANNEL MENTION OR ID');
                    channel = message.mentions.channels.first() || message.guild.channels.cache.get(channel);
                    if (!channel) return client.errors(message, 'err', 'Unable to find that channel.');
                    channel = channel.id;
                    settings.logging.msglog.channel = channel;
                        client.settings.set(message.guild.id, settings);
                        return success('message logging channel', `<#${channel}>`);
                };
                case 'type':{
                    let type = args[2];
                    if (!type) return client.errors(message, 'param', 'EMBED OR TEXT');
                    if (!['embed', 'text'].includes(type.toLowerCase())) return client.errors(message, 'param', 'EMBED, TEXT');
                    type = args[2].toLowerCase();
                    settings.logging.msglog.type = type;
                        client.settings.set(message.guild.id, settings);
                        return success('message logging type', type);
                };
            };
        };
        case 'roles':{
            let key2 = args[1];
            if (!key2) return client.errors(message, 'param', 'MUTE, ADMIN, MOD');
            if (!['mute', 'admin', 'mod'].includes(key2.toLowerCase())) return client.errors(message, 'err', 'Key must be `mute`, `admin`, or `mod`.');
            switch (key2.toLowerCase()) {
                case 'mute':{
                    let key3 = args[2];
                    if (!key3) return client.errors(message, 'param', '`REMOVE` OR `@ROLE`');
                    if (key3.toLowerCase() === 'remove') {
                        settings.roles.mute = null;
                        client.settings.set(message.guild.id, settings);
                        return success('muted role', 'not enabled');
                    } else {
                    let role = args[2];
                    if (!role) return client.errors(message, 'param', '`ROLE MENTION OR ID`, OR `REMOVE`');
                    role = message.mentions.roles.first() || message.guild.roles.cache.get(channel);
                    if (!role) return client.errors(message, 'err', 'Unable to find that role.');
                    settings.roles.muted = role.id;
                    client.settings.set(message.guild.id, settings);
                    return success('muted role', `<@&${role.id}>`);
                    };
                };
                case 'admin':{
                    let key3 = args[2];
                    if (!key3) return client.errors(message, 'param', '`REMOVE` OR `@ROLE`');
                    if (key3.toLowerCase() === 'remove') {
                        settings.roles.admin = null;
                        client.settings.set(message.guild.id, settings);
                        return success('admin role', 'not enabled');
                    } else {
                    let role = args[2];
                    if (!role) return client.errors(message, 'param', '`ROLE MENTION OR ID`, OR `REMOVE`');
                    role = message.mentions.roles.first() || message.guild.roles.cache.get(channel);
                    if (!role) return client.errors(message, 'err', 'Unable to find that role.');
                    role = role.id;
                    settings.roles.admin = role;
                        client.settings.set(message.guild.id, settings);
                        return success('admin role', `<@&${role}>`);
                    };
                };
                case 'mod':{
                    let key3 = args[2];
                    if (!key3) return client.errors(message, 'param', '`REMOVE` OR `@ROLE`');
                    if (key3.toLowerCase() === 'remove') {
                        settings.roles.mod = null;
                        client.settings.set(message.guild.id, settings);
                        return success('moderator role', 'not enabled');
                    } else {
                    let role = args[2];
                    if (!role) return client.errors(message, 'param', '`ROLE MENTION OR ID`, OR `REMOVE`');
                    role = message.mentions.roles.first() || message.guild.roles.cache.get(channel);
                    if (!role) return client.errors(message, 'err', 'Unable to find that role.');
                    role = role.id;
                    settings.roles.mod = role;
                        client.settings.set(message.guild.id, settings);
                        return success('moderator role', `<@&${role}>`);
                    };
                };
            };
        };
        case 'greeting':{
            let key2 = args[1];
            if (!key2) return client.errors(message, 'param', 'TOGGLE, SET, TYPE, TEXT');
            if (!['toggle', 'set', 'type', 'text'].includes(key2.toLowerCase())) return client.errors(message, 'err', 'Key must be `toggle`, `set`, `text` or `type`.');
            switch (key2.toLowerCase()) {
                case 'toggle':{
                    if (settings.logging.greeting.enabled) {
                        settings.logging.greeting.enabled = false;
                        client.settings.set(message.guild.id, settings);
                        return success('greeting', 'disabled');
                    } else if (!settings.logging.greeting.enabled) {
                        settings.logging.greeting.enabled = true;
                        client.settings.set(message.guild.id, settings);
                        return success('greeting', 'enabled');
                    };
                };
                case 'set':{
                    let channel = args[2];
                    if (!channel) return client.errors(message, 'param', 'CHANNEL MENTION OR ID');
                    channel = message.mentions.channels.first() || message.guild.channels.cache.get(channel);
                    if (!channel) return client.errors(message, 'err', 'Unable to find that channel.');
                    channel = channel.id;
                    settings.greeting.channel = channel;
                        client.settings.set(message.guild.id, settings);
                        return success('greeting channel', `<#${channel}>`);
                };
                case 'type':{
                    let type = args[2];
                    if (!type) return client.errors(message, 'param', 'EMBED OR TEXT');
                    if (!['embed', 'text'].includes(type.toLowerCase())) return client.errors(message, 'param', 'EMBED, TEXT');
                    type = args[2].toLowerCase();
                    settings.greeting.type = type;
                        client.settings.set(message.guild.id, settings);
                        return success('greeting type', type);
                };
                case 'text':{
                    let text = args.slice(2).join(' ');
                    if (!type) return client.errors(message, 'param', 'TEXT');
                    settings.greeting.text = text;
                        client.settings.set(message.guild.id, settings);
                        return success('greeting text', text);
                };
            };
        };
        case 'goodbye':{
            let key2 = args[1];
            if (!key2) return client.errors(message, 'param', 'TOGGLE, SET, TYPE, TEXT');
            if (!['toggle', 'set', 'type', 'text'].includes(key2.toLowerCase())) return client.errors(message, 'err', 'Key must be `toggle`, `set`, `text` or `type`.');
            switch (key2.toLowerCase()) {
                case 'toggle':{
                    if (settings.logging.goodbye.enabled) {
                        settings.logging.goodbye.enabled = false;
                        client.settings.set(message.guild.id, settings);
                        return success('goodbye', 'disabled');
                    } else if (!settings.logging.goodbye.enabled) {
                        settings.logging.goodbye.enabled = true;
                        client.settings.set(message.guild.id, settings);
                        return success('goodbye', 'enabled');
                    };
                };
                case 'set':{
                    let channel = args[2];
                    if (!channel) return client.errors(message, 'param', 'CHANNEL MENTION OR ID');
                    channel = message.mentions.channels.first() || message.guild.channels.cache.get(channel);
                    if (!channel) return client.errors(message, 'err', 'Unable to find that channel.');
                    channel = channel.id;
                    settings.goodbye.channel = channel;
                        client.settings.set(message.guild.id, settings);
                        return success('goodbye channel', `<#${channel}>`);
                };
                case 'type':{
                    let type = args[2];
                    if (!type) return client.errors(message, 'param', 'EMBED OR TEXT');
                    if (!['embed', 'text'].includes(type.toLowerCase())) return client.errors(message, 'param', 'EMBED, TEXT');
                    type = args[2].toLowerCase();
                    settings.goodbye.type = type;
                        client.settings.set(message.guild.id, settings);
                        return success('goodbye type', type);
                };
                case 'text':{
                    let text = args.slice(2).join(' ');
                    if (!type) return client.errors(message, 'param', 'TEXT');
                    settings.goodbye.text = text;
                        client.settings.set(message.guild.id, settings);
                        return success('goodbye text', text);
                };
            };
        };
    };
};

module.exports.conf = {
    enabled: true
}