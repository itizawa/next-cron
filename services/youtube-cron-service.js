require('dotenv').config();
const { format } = require('date-fns');
const { google } = require('googleapis');

const getYesterday = require('../libs/getYesterday');

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
   * Get channelIds by subscriptions
   * @memberof YoutubeCronService]
   *
   * @return {array} channelIds
   */
  async getChannelIds() {
    try {
      const res = await this.youtubeClient.subscriptions.list({
        part: 'snippet',
        mine: true,
        maxResults: 100,
      });

      // generate array
      const channelIds = res.data.items.map((item) => {
        return item.snippet.resourceId.channelId;
      });

      return channelIds;
    }
    catch (error) {
      // eslint-disable-next-line no-console
      console.log(error.errors);
      return [];
    }
  }

  /**
   * Create New Playlist
   * @memberof YoutubeCronService]
   * @return {object} created playlist
   */
  async createNewPlaylist() {
    try {
      const res = await this.youtubeClient.playlists.insert({
        part: 'snippet',
        resource: {
          snippet: {
            title: `${format(new Date(), 'yyyy-MM-dd')}`,
            tags: '自動保存',
            description: `作成日 ${format(new Date(), 'yyyy-MM-dd')}`,
          },
        },
      });

      return res.data;
    }
    catch (error) {
      // eslint-disable-next-line no-console
      console.log(error.errors);
      return null;
    }
  }

  /**
   * Get new video (1day) for each channel
   * @memberof YoutubeBatchService
   *
   * @param {subscriptionId} array
   * @param {object} id id of resourceId
   */
  async retrieveNewVideoIdsBySubscriptionId(channelIds) {

    const promises = channelIds.map(async(channelId) => {
      const movies = await this.youtubeClient.search.list({
        part: 'id',
        channelId,
        type: 'video',
        order: 'date',
        publishedAfter: getYesterday(),
      });

      return movies.data.items.map((item) => {
        return item.id;
      });
    });

    const results = await Promise.allSettled(promises);

    return results.flatMap((result) => {
      return result.value;
    });
  }

}

const service = new YoutubeCronService();
module.exports = service;
