const youtubeCronService = require('./services/youtube-cron-service');


async function main() {
  await youtubeCronService.init();
  const lists = await youtubeCronService.getSubscribedChannels();
  console.log(lists);
}


main();
