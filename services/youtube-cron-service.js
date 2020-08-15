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
   * 登録しているチャンネルを取得する
   * @memberof YoutubeCronService
   */
  async createPlaylist() {
    console.log('hoge');
  }

}

const service = new YoutubeCronService();
module.exports = service;
