require('dotenv').config();

const schedule = require('node-schedule');

const { format } = require('date-fns');
const { google } = require('googleapis');

const getYesterday = require('../libs/getYesterday');

class YoutubeService {

  constructor(nc) {
    this.nc = nc;

    this.youtubeJob = null;
    this.youtubeClient = undefined;
    this.enableCronJob = JSON.parse(process.env.ENABLE_YOUTUBE || false);
    this.playlistId = process.env.YOUTUBE_PLAYLIST_ID || null;
    this.slackChannel = process.env.CHANNEL_FOR_YOUTUBE || '#general';

    this.init();
  }

  async init() {
    if (!this.enableCronJob) {
      // eslint-disable-next-line no-console
      console.info('YoutubeService: ENABLE_YOUTUBE is false');
      return;
    }

    await this.setupService();
    this.setupSchedule();
  }

  async setupService() {
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

  setupSchedule() {
    // fire 8 hours every day
    this.youtubeJob = schedule.scheduleJob('0 0 8 * * *', async() => {
      // eslint-disable-next-line no-console
      console.log('YoutubeService: fire youtube notification');

      if (this.playlistId == null) {
        // eslint-disable-next-line no-console
        return console.log('Playlist id is not set');
      }

      const channelIds = await this.getChannelIds();
      const videoIds = await this.retrieveNewVideoIdsBySubscriptionId(channelIds);
      await this.insertVideosToPlayList(videoIds, this.playlistId);

      this.nc.slackNotificationService.fire(
        this.slackChannel, 'Youtube Bot', `再生リストに保存しました！\n https://www.youtube.com/playlist?list=${this.playlistId}`, 'movie_camera',
      );
    });

    // eslint-disable-next-line no-console
    console.info('YoutubeService: setup is done');
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
   * @memberof YoutubeCronService
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

  /**
   * Insert video to playlist
   * @memberof YoutubeCronService
   *
   * @param {string} videoId id of video
   * @param {object} playlistId id of playlist
   * @param {int} index index of position
   */
  async insertOneMovieToPlayList(videoId, playlistId, index = 0) {
    try {
      const res = await this.youtubeClient.playlistItems.insert({
        part: 'snippet',
        requestBody: {
          snippet: {
            position: index,
            playlistId,
            resourceId: videoId,
          },
        },
      });

      this.nc.slackNotificationService.fire(
        this.slackChannel, 'Youtube Bot', `再生リストに「${res.data.snippet.title}」を追加しました`, 'movie_camera',
      );

      // eslint-disable-next-line no-console
      return console.log(`YoutubeCronService:「${res.data.snippet.title}」を追加しました`);
    }
    catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  }

  /**
   * Add video to playlist
   * @memberof YoutubeCronService
   *
   * @param {array} videoIds ids of resourceId
   * @param {string} playlistId id of playlist
   */
  async insertVideosToPlayList(videoIds, playlistId) {

    const insertLoop = (maxCount, i) => {
      if (i < maxCount) {
        this.insertOneMovieToPlayList(videoIds[i], playlistId);
        // eslint-disable-next-line no-param-reassign
        setTimeout(() => { insertLoop(maxCount, ++i) }, 10000);
      }
    };

    // Can not save at the same time so provide 10 seconds interval.
    await insertLoop(videoIds.length, 0);

    // eslint-disable-next-line no-console
    return console.log('YoutubeCronService: insertVideosToPlayList is done');
  }

}

module.exports = YoutubeService;
