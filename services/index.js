
class NextCronService {

  constructor() {

    this.slackNotificationService = null;
    this.timeSignalService = null;
    this.youtubeService = null;
  }

  async setupService() {
    await this.setUpSlacklNotification();

    await Promise.all([
      this.setUpTimeSignalService(),
      this.setUpYoutubeService(),
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

}
module.exports = NextCronService;
