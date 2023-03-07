const cron = require("node-cron");
const fetch = require("node-fetch");
const Discord = require("discord.js");
const Twit = require("twit");
const dotenv = require("dotenv");
dotenv.config();

const discordClient = new Discord.Client();
discordClient.once("ready", () => {
  console.log("Discord ready!");
});

discordClient.login(process.env.DISCORD_TOKEN);

const twitterClient = new Twit({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token: process.env.TWITTER_ACCESS_TOKEN,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
});

const sendAphorism = async () => {
  try {
    const response = await fetch("https://partitasmusic.com/api/aphorism");
    const aphorism = await response.text();

    const aphorismWithQuotes = `"${aphorism}"`;
    console.log(aphorismWithQuotes);

    // Discord
    const discordChannel = discordClient.channels.cache.find(
      (channel) => channel.name === "📰daily-gc-aphorism"
    );
    await discordChannel.send(`*${aphorismWithQuotes}*`); // * makes it italics

    // Twitter
    await twitterClient.post("statuses/update", {
      status: aphorismWithQuotes,
    });
  } catch (error) {
    console.error("Error fetching or sending aphorism", error);
  }
};

module.exports = sendAphorism;
