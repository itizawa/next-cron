async function insertMovies(client, movies) {
  /**
   * insert movie into movie list
   * @param {object} id id of resourceId
   */
  async function insertMovie(id) {
    try {
      const res = await client.playlistItems.insert({
        part: "snippet",
        requestBody: {
          snippet: {
            playlistId: "PLhITUvsj989W0NjBPBuIln8QkFTD_fPjf",
            resourceId: id,
          },
        },
      });
      return res.data;
    } catch (error) {
      console.log(error);
    }
  }

  const result = [];
  for (const movie of movies) {
    result.push(await insertMovie(movie.id));
  }
  return result;
}

module.exports = insertMovies;
