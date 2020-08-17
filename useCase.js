const youtubeCronService = require('./services/youtube-service');


async function main() {
  await youtubeCronService.init();
  const [channelIds, newPlaylist] = await Promise.all([
    youtubeCronService.getChannelIds(),
    youtubeCronService.createNewPlaylist(),
  ]);

  const videoIds = await youtubeCronService.retrieveNewVideoIdsBySubscriptionId(channelIds);
  await youtubeCronService.insertVideosToPlayList(videoIds, newPlaylist.id);

}


main();
