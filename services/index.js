
class NextCronService {

  constructor() {

    this.slackNotificationService = null;
    this.timeSignalService = null;
  }

  async setupService() {
    await this.setUpSlacklNotification();

    await Promise.all([
      this.setUpTimeSignalService(),
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

}
module.exports = NextCronService;
