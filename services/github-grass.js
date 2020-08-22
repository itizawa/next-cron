const format = require('date-fns/format');
const axios = require('axios');
const schedule = require('node-schedule');

require('dotenv').config();

/**
 * the service class of GitHubGrassService
 */
class GitHubGrassService {

  constructor(nc) {
    this.nc = nc;
    this.githubGrassJob = null;
    this.enableCronJob = JSON.parse(process.env.ENABLE_GITHUB_GRASS || false);
    this.slackChannel = process.env.CHANNEL_FOR_GITHUB_GRASS || '#general';
    this.githubUsername = process.env.GITHUB_USERNAME;

    this.init();
  }

  init() {
    if (!this.enableCronJob) {
      // eslint-disable-next-line no-console
      console.info('GitHubGrassService: ENABLE_GITHUB_GRASS is false');
      return;
    }

    this.setupSchedule();
  }

  setupSchedule() {
    this.githubGrassJob = schedule.scheduleJob('* * 18 * * *', async() => {
      // eslint-disable-next-line no-console
      console.log(`GitHubGrassService: fire github grass service ${new Date()}`);

      const grasses = await this.retrieveGrasses();

      this.nc.slackNotificationService.fire(
        this.slackChannel, 'GiuHub Grass', `Dayliy Notification \n 本日の Contribute 数は ${grasses[0].data_count} です！`, ':four_leaf_clover:',
      );
    });

    this.githubGrassJob = schedule.scheduleJob('* * 21 * * sun', async() => {
      // eslint-disable-next-line no-console
      console.log(`GitHubGrassService: fire github grass service ${new Date()}`);

      const grasses = await this.retrieveGrasses();
      let totalCount = 0;
      const weeklyGrasses = grasses.map((grass, index) => {
        if (index >= 7) {
          return null;
        }
        totalCount += parseInt(grass.data_count);
        return `${grass.data_date} の Contribute 数は ${grass.data_count} です。`;
      });
      const displayMessage = weeklyGrasses.join('\n');

      this.nc.slackNotificationService.fire(
        this.slackChannel, 'GiuHub Grass', `Weekly Notification \n 合計値: ${totalCount} 平均値: ${totalCount / 7} \n ${displayMessage}`, ':four_leaf_clover:',
      );
    });

    // eslint-disable-next-line no-console
    console.info('GitHubGrassService: setup is done');
  }

  async retrieveGrasses() {
    const res = await axios.get(`https://github.com/users/${this.githubUsername}/contributions`);
    const grassElement = res.data.toString().match(/<rect(?: [\s\S]+?)?\/>/g);
    return grassElement.map((x) => {
      return { data_date: x.split(' ')[8].slice(11, 21), data_count: Number(x.split(' ')[7].split('"').join('').slice(11)) };
    }).reverse();
  }

}

module.exports = GitHubGrassService;
