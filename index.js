// DASBOARD
const express = require("express");
const app = express();
const _PORT = process.env.PORT || 8080;
//
const { token, default_prefix } = require("./config.json");
const { config } = require("dotenv");
const Discord = require("discord.js");
const bot = new Discord.Client({
  disableEveryone: true
});
const db = require("quick.db");
bot.commands = new Discord.Collection();
bot.aliases = new Discord.Collection();

["command"].forEach(handler => {
  require(`./handlers/${handler}`)(bot);
});

bot.on("ready", () => {
  console.log("Bot is online senpai >_<");

  let setatus = [
    "Saekyo",
    `${bot.guilds.cache.size} servers`,
    `${bot.channels.cache.size} channels`,
    `${bot.users.cache.size} users`,
    `Made with 💙 by Saekyo`
  ];
  setInterval(() => {
    let index = Math.floor(Math.random() * (setatus.length - 1) + 1);

    bot.user.setActivity(`${db.get(`status`)} | ` + setatus[index], {
      type: "STREAMING",
      URL: "https://www.twitch.tv/chilledcatradio"
    });
  }, 300000);
});

const socketStats = require("socketstats");
const server = new socketStats(app, bot);

server.listen(_PORT, () => {
  console.log("Listening to port: " + _PORT);
});

bot.on("message", async message => {
  if (message.content === "<@761479515637022720>") {
    let prefix = db.get(`prefix_${message.guild.id}`);
    if (prefix === null) prefix = default_prefix;
    const Menembed = new Discord.MessageEmbed().setDescription(
      `My Prefix in this guild is \`${prefix}\` \nTo get started type \`${prefix}help\``
    );
    message.channel.send(Menembed);
  }

  //BATAS BAWAH AFK
  if (!message.guild) return;
  let prefix = db.get(`prefix_${message.guild.id}`);
  if (prefix === null) prefix = default_prefix;

  if (!message.content.startsWith(prefix)) return;

  if (!message.member)
    message.member = await message.guild.fetchMember(message);

  const args = message.content
    .slice(prefix.length)
    .trim()
    .split(/ +/g);
  const cmd = args.shift().toLowerCase();

  if (cmd.length === 0) return;

  let command = bot.commands.get(cmd);

  if (!command) command = bot.commands.get(bot.aliases.get(cmd));
  if (command) command.run(bot, message, args);
});
bot.login(token);
