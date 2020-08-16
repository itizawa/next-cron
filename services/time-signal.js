require('dotenv').config();
const getConfig = require('next/config');
const schedule = require('node-schedule');

const { publicRuntimeConfig } = getConfig();
class TimeSignalService {

  constructor(nc) {
    this.nc = nc;

    this.timeSignalJob = null;
    this.enableCronJob = JSON.parse(publicRuntimeConfig.ENABLE_TIME_SIGNAL) || false;

    this.init();
  }

  init() {
    if (!this.enableCronJob) {
      // eslint-disable-next-line no-console
      console.info('TimeSignalService: ENABLE_TIME_SIGNAL is false');
      return;
    }

    this.setupSchedule();
  }

  setupSchedule() {
    // every 10 seconds
    this.timeSignalJob = schedule.scheduleJob('*/30 * * * * *', async() => {
      // eslint-disable-next-line no-console
      this.nc.slackNotificationService.fire('#slack_bot', 'testbot', `現在の時間は ${new Date()}`);
    });

    // eslint-disable-next-line no-console
    console.info('TimeSignalService: setup is done');
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

module.exports = TimeSignalService;
