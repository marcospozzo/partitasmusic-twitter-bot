const Discord = require("discord.js");
const client = new Discord.Client();
const T = require("./twit");
const cron = require("node-cron");
const fetch = require("node-fetch");
const dotenv = require("dotenv");
dotenv.config();

const task = cron.schedule("0 15 * * *", () => {
  getAphorism()
    .then((aphorism) => {
      const aphorismWithQuotes = `"${aphorism}"`;
      console.log(aphorismWithQuotes);

      // Discord
      const channel = client.channels.cache.find(
        (channel) => channel.name === "📰daily-gc-aphorism"
      );
      channel.send(`*${aphorismWithQuotes}*`); // * makes it italics

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

client.once("ready", () => {
  console.log("Discord ready!");
});

client.login(process.env.DISCORD_TOKEN);
