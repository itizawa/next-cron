require("dotenv").config();
const getYesterday = require("./getYesterday");

async function retrieveNewMovies(client, channels) {
  /**
   * retrieve new movie for save
   * @param {object} id id of channel
   */
  async function retrieveMovie(id) {
    console.log(id);
    try {
      const res = await client.search.list({
        part: "id,snippet",
        channelId: id,
        order: "date",
        publishedAfter: getYesterday(),
      });
      console.log(res.data.items);
      return res.data.items;
    } catch (error) {
      return console.log(error);
    }
  }

  const result = [];
  for (const channel of channels) {
    // const { channelId } = channel.snippet;
    console.log(channel);
    // result.push(...(await retrieveMovie(channelId)));
  }
  return result;
}

module.exports = retrieveNewMovies;
const channelIds = ["UCFo4kqllbcQ4nV83WCyraiw"];
