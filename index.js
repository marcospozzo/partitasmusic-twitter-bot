const Discord = require("discord.js");
const client = new Discord.Client();
const T = require("./twit");
const prefix = require("./config.json");
const cron = require("node-cron");
const fetch = require("node-fetch");
const dotenv = require("dotenv");
dotenv.config();

client.once("ready", () => {
  console.log("Discord ready!");
});

client.on("message", (message) => {
  if (message.content === `${prefix}ping`) {
    // send back "Pong." to the channel the message was sent in
    message.channel.send("Pong.");
  }
});

// const random = (min, max) => Math.floor(Math.random() * (max - min)) + min;
// 0-59/6 // this divides the interval 0-59 into 6 parts

const task = cron.schedule("0 15 * * *", () => {
  getAphorism()
    .then((aphorism) => {
      const aphorismWithQuotes = `"${aphorism}"`;
      console.log(aphorismWithQuotes);

      // Discord
      const channel = client.channels.cache.find(
        (channel) => channel.name === "📰daily-gc-aphorism"
      );
      channel.send(aphorismWithQuotes);

      // Twitter
      T.post(
        "statuses/update",
        { status: aphorismWithQuotes },
        function (err, data, response) {
          if (err) {
            console.error(err);
          }
        }
      );
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

async function getAphorism() {
  const response = await fetch("https://partitasmusic.com/api/aphorism");
  const aphorism = await response.text();
  return aphorism;
}

client.login(process.env.DISCORD_TOKEN);
