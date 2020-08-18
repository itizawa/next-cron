require('dotenv').config();

const schedule = require('node-schedule');

class TimeSignalService {

  constructor(nc) {
    this.nc = nc;

    this.timeSignalJob = null;
    this.enableCronJob = JSON.parse(process.env.ENABLE_TIME_SIGNAL) || false;
    this.slackChannel = process.env.CHANNEL_FOR_TIME_SIGNAL || '#general';

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
    this.timeSignalJob = schedule.scheduleJob('0 0 * * * *', async() => {
      // eslint-disable-next-line no-console
      console.log(`TimeSignalService: fire time signal ${new Date()}`);
      this.nc.slackNotificationService.fire(
        this.slackChannel, 'Time Signal', `現在の時間は ${new Date()}`, ':stopwatch:',
      );
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
