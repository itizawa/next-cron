require('dotenv').config();

const schedule = require('node-schedule');

/**
 * the service class of GitHubGrassService
 */
class GitHubGrassService {

  constructor(nc) {
    this.nc = nc;
    this.githubGrassJob = null;
    this.enableCronJob = JSON.parse(process.env.ENABLE_GITHUB_GRASS || false);

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
    this.githubGrassJob = schedule.scheduleJob('0 * * * * *', async() => {
      // eslint-disable-next-line no-console
      console.log(`GitHubGrassService: fire github grass service ${new Date()}`);
    });

    // eslint-disable-next-line no-console
    console.info('GitHubGrassService: setup is done');
  }

}

module.exports = GitHubGrassService;
