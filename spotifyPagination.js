require("dotenv").config();
const fetch = require("node-fetch");
const SPOTIFY_PLAYLIST = process.env.SPOTIFY_PLAYLIST;

let spotPageTokens = [];

async function spotifyPagination(spotifyToken) {
  const endpoint2 = `https://api.spotify.com/v1/playlists/${SPOTIFY_PLAYLIST}`;

  try {
    const response2 = await fetch(endpoint2, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${spotifyToken}`,
      },
    });
    if (response2.ok) {
      const data2 = await response2.json();
      let i = 0;
      let antallFullesider = Math.floor(data2.tracks.total / 100);
      let offset = 0;
      while (i < antallFullesider) {
        try {
          let nextSpotPageToken = await fetch(
            `https://api.spotify.com/v1/playlists/${SPOTIFY_PLAYLIST}/tracks?offset=${offset}&limit=100`,
            {
              method: "GET",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${spotifyToken}`,
              },
            }
          );
          if (nextSpotPageToken.ok) {
            let spotpagetoken = await nextSpotPageToken.json();
            spotPageTokens.push(spotpagetoken.next);
            offset += 100;
            i++;
          }
        } catch (error) {}
      }
      module.exports.spotPageTokens = spotPageTokens;
    }
  } catch (err) {
    console.log(err);
  }
}

//spotifyPagination(token);
module.exports = spotifyPagination;
