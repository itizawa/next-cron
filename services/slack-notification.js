require('dotenv').config();
const Slack = require('slack-node');

const webhookUri = process.env.WEBHOOK_URL;

class SlackNotification {

  constructor() {
    this.slack = new Slack();
    this.slack.setWebhook(webhookUri);
  }

  fire(channel, username, text) {
    this.slack.webhook({
      channel,
      username,
      text,
    }, (err, response) => {
      if (err == null) return;
      // eslint-disable-next-line no-console
      console.log(err);
    });

  }

}

const service = new SlackNotification();
module.exports = service;
