require("dotenv").config();
const fetch = require("node-fetch");
const fs = require("fs");
const SPOTIFY_PLAYLIST = process.env.SPOTIFY_PLAYLIST;

let spotifyArray = [];

async function readSpotifyList(spotifyToken) {
  try {
    const response = await fetch(
      `https://api.spotify.com/v1/playlists/${SPOTIFY_PLAYLIST}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${spotifyToken}`,
        },
      }
    );
    if (response.ok) {
      const data = await response.json();
      let offset = 0;
      let i = 0;
      let antallFullesider = Math.floor(data.tracks.total / 100);
      while (i <= antallFullesider) {
        try {
          const response2 = await fetch(
            `https://api.spotify.com/v1/playlists/${SPOTIFY_PLAYLIST}/tracks?market=NO&fields=items(track.name,track.id(name))&offset=${offset}&limit=100`,
            {
              method: "GET",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${spotifyToken}`,
              },
            }
          );
          if (response2.ok) {
            const data2 = await response2.json();
            //Looper alle sangene i playlist og legger dem til et array(spotifyArray)
            async function spotifyLoop() {
              for (let i = 0; i < data2.items.length; i++) {
                spotifyArray.push(data2.items[i].track.id);
              }
            }
            await spotifyLoop();
            i++;
            offset += 100;
          } else {
            console.log("error");
          }
        } catch (error) {
          console.log(error);
        }
      }
      module.exports.spotifyArray = spotifyArray;
    }
  } catch (err) {
    console.log(err);
  }
}

//readSpotifyList(token);
module.exports = readSpotifyList;
