require('dotenv').config();

const schedule = require('node-schedule');
const slackNotification = require('./slack-notification');

class BrokenRadio {

  constructor() {
    this.brokenRadio = null;
    this.enableCronJob = true;
  }

  getEnableCronJob() {
    return this.enableCronJob;
  }


  init() {
    if (!this.getEnableCronJob()) {
      return;
    }

    this.setupSchedule();
  }

  setupSchedule() {
    // every 10 seconds
    schedule.scheduleJob('*/10 * * * * *', async() => {
      // eslint-disable-next-line no-console
      slackNotification.fire('#slack_bot', 'itizawa', `現在の時間は ${new Date()}`);
    });
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

const service = new BrokenRadio();
module.exports = service;
