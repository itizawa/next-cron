require('dotenv').config();
const Slack = require('slack-node');

const getConfig = require('next/config');

const { publicRuntimeConfig } = getConfig();

const webhookUri = publicRuntimeConfig.WEBHOOK_URL;

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

module.exports = SlackNotificationService;
