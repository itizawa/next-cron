
class NextCronService {

  constructor() {

    this.slackNotificationService = null;
    this.brokenRadioService = null;
  }

  async setupService() {
    await Promise.all([
      this.setUpSlacklNotification(),
      this.setUpBrokenRadioService(),
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
   * setup BrokenRadioService
   */
  setUpBrokenRadioService() {
    const BrokenRadioService = require('./broken-radio');
    if (this.brokenRadioService == null) {
      this.brokenRadioService = new BrokenRadioService(this);
    }
  }

}
module.exports = NextCronService;
