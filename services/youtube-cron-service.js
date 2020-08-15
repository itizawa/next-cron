require('dotenv').config();
const { google } = require('googleapis');

class YoutubeCronService {

  constructor() {
    this.youtubeClient = undefined;
  }

  async init() {
    const { OAuth2 } = google.auth;
    const clientId = process.env.YOUTUBE_CLIENT_ID;
    const clientSecret = process.env.YOUTUBE_CLIENT_SECRET;
    const refreshToken = process.env.YOUTUBE_REFRESH_TOKEN;

    const authClient = new OAuth2(clientId, clientSecret, 'http://localhost');

    authClient.setCredentials({ refresh_token: refreshToken });
    const client = await google.youtube({
      version: 'v3',
      auth: authClient,
    });

    this.youtubeClient = client;
  }

  /**
   * Get subscribed channels
   * @memberof YoutubeCronService]
   * @return {array} subscribed channels
   */
  async getSubscribedChannels() {
    try {
      const res = await this.youtubeClient.subscriptions.list({
        part: 'id',
        mine: true,
        maxResults: 100,
      });

      return res.data.items;
    }
    catch (error) {
      // eslint-disable-next-line no-console
      console.log(error.errors);
      return [];
    }
  }

}

const service = new YoutubeCronService();
module.exports = service;
