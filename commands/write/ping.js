const Discord = require("discord.js");

module.exports = {
  name: "ping",
  category: "🌏 | Main",
  description: "Check bot ping",
  run: async (bot, message, args) => {
    const m = await message.channel.send("Pinging...");
    m.edit(
      `🏓Latency is ` +
        "`" +
        `${m.createdTimestamp - message.createdTimestamp}ms` +
        "`" +
        ` | API Latency is ` +
        "`" +
        `${Math.round(bot.ws.ping)}ms` +
        "`" +
        ``
    );
  }
};
