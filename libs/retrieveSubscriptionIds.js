const getYesterday = require("./getYesterday");

async function retrieveSubscriptionIds(client) {
  const res = await client.subscriptions.list({
    part: "snippet",
    mine: true,
    publishedAfter: getYesterday(),
  });

  const channels = res.data.items;

  const result = [];
  for (const channel of channels) {
    console.log(channel.snippet.resourceId);
    // result.push(await channel.snippet.resourceId.channelId);
  }

  return result;
}

module.exports = retrieveSubscriptionIds;
