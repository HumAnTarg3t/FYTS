require("dotenv").config();
const fetch = require("node-fetch");
const playlist_id = process.env.SPOTIFY_PLAYLIST;
const chalk = require("chalk");

async function addTrackToSpotify(trackID, spotifyToken) {
  const endpoint = `https://api.spotify.com/v1/playlists/${playlist_id}/tracks`;

  try {
    const data = JSON.stringify({
      uris: [`spotify:track:${trackID}`],
    });
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${spotifyToken}`,
      },
      body: data,
    });
    if (response.status === 201) {
      console.log(
        chalk.green(
          `
---------------------------------------------------------
Status: ${response.status}(${response.statusText})
---------------------------------------------------------
`
        )
      );
    } else {
      console.log(
        chalk.red(
          `
---------------------------------------------------------
Status: ${response.status}(${response.statusText})
---------------------------------------------------------
`
        )
      );
    }
  } catch (error) {
    console.log(error);
  }
}

module.exports = addTrackToSpotify;
