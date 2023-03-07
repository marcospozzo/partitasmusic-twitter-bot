import sendAphorism from "../index.js";

export default function (req, res) {
  sendAphorism();
  res.status(200).send("Cron job executed successfully!");
}
