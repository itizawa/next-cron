require('dotenv').config();
const Slack = require('slack-node');

const webhookUri = process.env.WEBHOOK_URL;

/**
 * the service class of SlackNotificationService
 */
class SlackNotificationService {

  constructor(nc) {
    this.nc = nc;
    this.slack = undefined;

    this.init();
  }

  init() {
    this.slack = new Slack();
    this.slack.setWebhook(webhookUri);
  }

  fire(channel, username, text, icon_emoji = ':tada:') {
    this.slack.webhook({
      channel,
      username,
      text,
      icon_emoji,
    }, (err, response) => {
      if (err == null) return;
      // eslint-disable-next-line no-console
      console.log(err);
    });

  }

}

module.exports = SlackNotificationService;
