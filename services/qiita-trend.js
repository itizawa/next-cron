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
    this.searchText = process.env.SEARCH_WORD_FOR_QIITA_TREND || 'javascript';
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
    this.qiitaTrendRetrieveJob = schedule.scheduleJob('0 0 14 * * *', async() => {
      // eslint-disable-next-line no-console
      console.log(`QiitaTrendService: fire github grass service ${new Date()}`);

      const res = await axios.get(`https://qiita.com/api/v2/items?page=1&per_page=100&query=${this.searchText}`);
      const articles = res.data.map((item) => {
        return {
          title: item.title,
          url: item.url,
          likes: item.likes_count,
        };
      });

      articles.sort((a, b) => {
        if (a.likes > b.likes) return -1;
        if (a.likes < b.likes) return 1;
        return 0;
      });

      this.dayliyArticle = articles;

      // reset index
      this.index = 0;

    });

    this.qiitaNotifySlackJob = schedule.scheduleJob('0 */20 * * * *', async() => {
      if (this.dayliyArticle == null) {
        // eslint-disable-next-line no-console
        return console.log('QiitaTrendService: dayliy article is null');
      }
      // eslint-disable-next-line no-console
      console.log(`QiitaTrendService: fire qiita notify to slack ${new Date()}`);

      const article = this.dayliyArticle[this.index];

      this.nc.slackNotificationService.fire(
        this.slackChannel, 'Qiita Trend', `${article.title} \n ${article.url}`, ':memo:',
      );

      this.index += 1;
    });

    // eslint-disable-next-line no-console
    console.info('QiitaTrendService: setup is done');
  }


}

module.exports = QiitaTrendService;
