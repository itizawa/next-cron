
class nextCronService {

  constructor() {

    this.slackNotificationService = null;

  }

  async setupService() {
    await Promise.all([
      this.setUpSlacklNotification(),
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

}
module.exports = nextCronService;
