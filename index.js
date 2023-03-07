import fetch from "node-fetch";
import Twit from "twit";
import { config } from "dotenv";
config();

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

    // Twitter
    await twitterClient.post("statuses/update", {
      status: aphorismWithQuotes,
    });
  } catch (error) {
    console.error("Error fetching or sending aphorism", error);
  }
};

export default sendAphorism;
