const { Client } = require('discord.js');
const Enmap = require('enmap');
const fs = require('fs');
const client = new Client();
require('dotenv').config();
client.login(process.env.TOKEN);
client.defaultSettings = require('./default_settings');
client.settings = new Enmap({ name: 'settings' });
client.modCases = new Enmap({ name: 'moderation-cases-guild' });
client.userModCases = new Enmap({ name: 'user-mod-cases' });
//client.execHelp = require('./functions/execHelp.js');
client.commands = new Enmap();
client.aliases = new Enmap();
client.errors = require('./functions/error.js');
client.emotes = {
  warn: '<:firebotWarn:708074523068727366>',
  check: '<:firebotCheck:708074522674331830>',
  x: '<:firebotX:708074522909212806>',
  text: '<:firebotText:708169493964390471>',
  voice: '<:firebotVoice:708169494199140362>'
};

  fs.readdir("./commands/admin/", (err, files) => {
    if (err) return console.error(err);
    files.forEach(file => {
      if (!file.endsWith(".js")) return;
      let props = require(`./commands/admin/${file}`);
      let commandName = file.split(".")[0];
      console.log(`Attempting to load command ${commandName}`);
      client.commands.set(commandName, props);
      console.log('Attempting to load aliases');
      if (!typeof(props.aliases) !== 'array') return console.log("No aliases to set.")
      for (let  i in props.aliases) {
        client.aliases.set(props.aliases[i], commandName);
        console.log(`Aliase '${props.aliases[i]}' set.`);
      };
      console.log(`[ LOADED ] Loaded command ${props.help.name}`);
    });
  });
  fs.readdir("./commands/devOnly/", (err, files) => {
    if (err) return console.error(err);
    files.forEach(file => {
      if (!file.endsWith(".js")) return;
      let props = require(`./commands/devOnly/${file}`);
      let commandName = file.split(".")[0];
      console.log(`Attempting to load command ${commandName}`);
      client.commands.set(commandName, props);
      console.log('Attempting to load aliases');
      for (let  i in props.aliases) {
        console.log("HFHDHDHDHDHD")
        console.log(props.aliases)
        client.aliases.set(props.aliases[i], props);
        console.log(`Aliase '${props.aliases[i]}' set.`);
      };
      console.log(`[ LOADED ] Loaded command ${props.help.name}`)
    });
  });
  fs.readdir("./commands/fun/", (err, files) => {
    if (err) return console.error(err);
    files.forEach(file => {
      if (!file.endsWith(".js")) return;
      let props = require(`./commands/fun/${file}`);
      let commandName = file.split(".")[0];
      console.log(`Attempting to load command ${commandName}`);
      client.commands.set(commandName, props);
      console.log('Attempting to load aliases');
      for (let  i in props.aliases) {
        client.aliases.set(props.aliases[i], commandName);
        console.log(`Aliase '${props.aliases[i]}' set.`);
      };
      console.log(`[ LOADED ] Loaded command ${props.help.name}`)
    });
  });
  fs.readdir("./commands/moderator/", (err, files) => {
    if (err) return console.error(err);
    files.forEach(file => {
      if (!file.endsWith(".js")) return;
      let props = require(`./commands/moderator/${file}`);
      let commandName = file.split(".")[0];
      console.log(`Attempting to load command ${commandName}`);
      client.commands.set(commandName, props);
      console.log('Attempting to load aliases');
      for (let  i in props.help.aliases) {
        client.aliases.set(props.help.aliases[i], props);
        console.log(`Aliase '${props.help.aliases[i]}' set.`);
      };
      console.log(`[ LOADED ] Loaded command ${props.help.name}`)
    });
  });
  fs.readdir("./commands/utility/", (err, files) => {
    if (err) return console.error(err);
    files.forEach(file => {
      if (!file.endsWith(".js")) return;
      let props = require(`./commands/utility/${file}`);
      let commandName = file.split(".")[0];
      console.log(`Attempting to load command ${commandName}`);
      client.commands.set(commandName, props);
      console.log('Attempting to load aliases');
      for (let  i in props.help.aliases) {
        client.aliases.set(props.help.aliases[i], props);
        console.log(`Aliase '${props.help.aliases[i]}' set.`);
      };
      console.log(`[ LOADED ] Loaded command ${props.help.name}`)
    });
  });
//
//
fs.readdir("./events/", (err, files) => {
  if (err) return console.error(err);
  files.forEach(file => {
    const event = require(`./events/${file}`);
    let eventName = file.split(".")[0];
    client.on(eventName, event.bind(null, client));
  });
});

process.on('unhandledRejection', e => console.log(e));