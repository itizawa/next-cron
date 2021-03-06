
class NextCronService {

  constructor() {

    this.slackNotificationService = null;
    this.timeSignalService = null;
    this.youtubeService = null;
    this.githubGrassService = null;
    this.qiitaTrendService = null;
  }

  async setupService() {
    await this.setUpSlacklNotification();

    await Promise.all([
      this.setUpTimeSignalService(),
      this.setUpYoutubeService(),
      this.setUpGitHubGrassService(),
      this.setUpQiitaTrendService(),
    ]);
  }

  /**
   * setup SlackNotificationService
   */
  setUpSlacklNotification() {
    const SlackNotificationService = require('./slack-notification');
    if (this.slackNotificationService == null) {
      this.slackNotificationService = new SlackNotificationService(this);
    }
  }

  /**
   * setup TimeSignalService
   */
  setUpTimeSignalService() {
    const TimeSignalService = require('./time-signal');
    if (this.timeSignalService == null) {
      this.timeSignalService = new TimeSignalService(this);
    }
  }

  /**
   * setup YoutubeService
   */
  setUpYoutubeService() {
    const YoutubeService = require('./youtube-service');
    if (this.youtubeService == null) {
      this.youtubeService = new YoutubeService(this);
    }
  }

  /**
   * setup GitHubGrassService
   */
  setUpGitHubGrassService() {
    const GitHubGrassService = require('./github-grass');
    if (this.githubGrassService == null) {
      this.githubGrassService = new GitHubGrassService(this);
    }
  }

  /**
   * setup QiitaTrendService
   */
  setUpQiitaTrendService() {
    const QiitaTrendService = require('./qiita-trend');
    if (this.qiitaTrendService == null) {
      this.qiitaTrendService = new QiitaTrendService(this);
    }
  }

}
module.exports = NextCronService;
