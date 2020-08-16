require('dotenv').config();

const schedule = require('node-schedule');

class BrokenRadioService {

  constructor(nc) {
    this.nc = nc;

    this.brokenRadioJob = null;
    this.enableCronJob = JSON.parse(process.env.ENABLE_BROKEN_RADIO) || false;

    this.init();
  }

  init() {
    if (!this.enableCronJob) {
      // eslint-disable-next-line no-console
      console.info('BrokenRadioService: ENABLE_BROKEN_RADIO is false');
      return;
    }

    this.setupSchedule();
  }

  setupSchedule() {
    // every 10 seconds
    this.brokenRadioJob = schedule.scheduleJob('*/10 * * * * *', async() => {
      // eslint-disable-next-line no-console
      this.nc.slackNotificationService.fire('#slack_bot', 'testbot', `現在の時間は ${new Date()}`);
    });

    // eslint-disable-next-line no-console
    console.info('BrokenRadioService: setup is done');
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

module.exports = BrokenRadioService;
