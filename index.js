const dotenv = require("dotenv");
dotenv.config();

const prefix = require("./config.json");
const cron = require("node-cron");
const fetch = require("node-fetch");

const Discord = require("discord.js");
const client = new Discord.Client();

client.once("ready", () => {
  console.log("Ready!");
});

// const random = (min, max) => Math.floor(Math.random() * (max - min)) + min;
// 0-59/6 // this divides the interval 0-59 into 6 parts

const task = cron.schedule("* * * * *", () => {
  getAphorism()
    .then((aphorism) => {
      console.log(`"${aphorism}"`);
      const channel = client.channels.cache.find(
        (channel) => channel.name === "general"
      );
      channel.send(`"${aphorism}"`);
    })
    .catch((error) => {
      console.log("error fetching aphorism");
      console.error(error);
    }),
    {
      scheduled: true, // default
      //   timezone: "America/Argentina/Buenos_Aires",
    };
});

client.on("message", (message) => {
  if (message.content === `${prefix}ping`) {
    // send back "Pong." to the channel the message was sent in
    message.channel.send("Pong.");
  }
});

async function getAphorism() {
  const response = await fetch("https://partitasmusic.com/aphorism");
  const aphorism = await response.text();
  return aphorism;
}

client.login(process.env.TOKEN);