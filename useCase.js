const youtubeCronService = require('./services/youtube-cron-service');


async function main() {
  await youtubeCronService.init();
  // const channelIds = await youtubeCronService.getChannelIds();

  // TODO テスト ids
  const channelIds = ['UC1EB8moGYdkoZQfWHjh7Ivw', 'UCFo4kqllbcQ4nV83WCyraiw'];

  const newPlaylist = await youtubeCronService.createNewPlaylist();

  const videoIds = await youtubeCronService.retrieveNewVideoIdsBySubscriptionId(channelIds);

  await youtubeCronService.insertVideosToPlayList(videoIds, newPlaylist.id);

}


main();
