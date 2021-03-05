require("dotenv").config();
const fetch = require("node-fetch");
const fs = require("fs");
const chalk = require("chalk");

async function searchSpotify(spotifyToken, ytQuery) {
  console.log(`Searching for the song grabbed by Youtube`);
  //Her er den gamle queryen
  //const endpoint = `https://api.spotify.com/v1/search?q=${ytQuery}&type=track&limit=1`;
  const endpoint = `https://api.spotify.com/v1/search?q=${ytQuery}&type=track%2Cartist&limit=1`;
  try {
    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${spotifyToken}`,
      },
    });
    if (response.ok) {
      const data = await response.json();
      console.log(`Tracks total: ${data.tracks.total}`);

      if (data.tracks.total <= 0) {
        console.log(
          chalk.red(
            `
Sorry, the title probably had to many unnecessary words
Title: ${decodeURI(ytQuery)}
Skipped this one.
`
          )
        );
      } else {
        console.log("Found it:");
        console.log(
          chalk.cyan(
            `
Spotify name: ${data.tracks.items[0].name}
Spoitfy_ID: ${data.tracks.items[0].id}
`
          )
        );
        return data.tracks.items[0].id;
      }
    } else if (response.status === 401) {
      console.clear();
      console.log("RENEW YOUR SPOTIFY TOKEN");
      process.exit();
    }
  } catch (error) {
    console.log(error);
  }
}
module.exports = searchSpotify;
