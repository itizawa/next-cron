const youtubeCronService = require('./services/youtube-cron-service');


async function main() {
  await youtubeCronService.init();
  // const channelIds = await youtubeCronService.getChannelIds();

  // TODO テスト ids
  const channelIds = ['UC1EB8moGYdkoZQfWHjh7Ivw', 'UCFo4kqllbcQ4nV83WCyraiw'];

  const newVideoIds = await youtubeCronService.retrieveNewVideoIdsBySubscriptionId(channelIds);
  console.log(newVideoIds);

  // const newPlaylist = await youtubeCronService.createNewPlaylist();
}


main();
