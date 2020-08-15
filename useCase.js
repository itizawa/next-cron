const youtubeCronService = require('./services/youtube-cron-service');


async function main() {
  await youtubeCronService.init();
  // const lists = await youtubeCronService.getSubscribedChannels();
  // const newPlaylist = await youtubeCronService.createNewPlaylist();
}


main();
