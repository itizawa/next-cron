const axios = require('axios');
const schedule = require('node-schedule');

require('dotenv').config();

/**
 * the service class of QiitaTrendService
 */
class QiitaTrendService {

  constructor(nc) {
    this.nc = nc;
    this.qiitaTrendRetrieveJob = null;
    this.qiitaNotifySlackJob = null;
    this.enableCronJob = JSON.parse(process.env.ENABLE_QIITA_TREND || false);
    this.slackChannel = process.env.CHANNEL_FOR_QIITA_TREND || '#general';
    this.githubUsername = process.env.GITHUB_USERNAME;
    this.dayliyArticle = null;
    this.index = 0;

    this.init();
  }

  init() {
    if (!this.enableCronJob) {
      // eslint-disable-next-line no-console
      console.info('QiitaTrendService: ENABLE_QIITA_TREND is false');
      return;
    }

    this.setupSchedule();
  }

  setupSchedule() {
    this.qiitaTrendRetrieveJob = schedule.scheduleJob('0 0 */3 * * *', async() => {
      // eslint-disable-next-line no-console
      console.log(`QiitaTrendService: fire github grass service ${new Date()}`);

      const res = await axios.get('https://qiita.com/api/v2/items?page=1&per_page=100&query=react');
      this.dayliyArticle = res.data.map((item) => {
        return item.url;
      });

      // reset index
      this.index = 0;

    });

    this.qiitaNotifySlackJob = schedule.scheduleJob('0 */10 * * * *', async() => {
      if (this.dayliyArticle == null) {
        // eslint-disable-next-line no-console
        return console.log('QiitaTrendService: dayliy article is null');
      }
      // eslint-disable-next-line no-console
      console.log(`QiitaTrendService: fire qiita notify to slack ${new Date()}`);

      this.nc.slackNotificationService.fire(
        this.slackChannel, 'Qiita Trend', `${this.dayliyArticle[this.index]}`, ':memo:',
      );

      this.index += 1;
    });

    // eslint-disable-next-line no-console
    console.info('QiitaTrendService: setup is done');
  }


}

module.exports = QiitaTrendService;
