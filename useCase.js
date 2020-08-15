const youtubeCronService = require('./services/youtube-cron-service');


async function main() {
  await youtubeCronService.init();
  await youtubeCronService.createPlaylist();
}


main();
