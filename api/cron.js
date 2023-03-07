const sendAphorism = require("../index.js");

export default async function (req, res) {
  await sendAphorism();
  console.log("Cron job executed successfully!");
  res.status(200).send("Cron job executed successfully!");
}
