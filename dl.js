const ytdl = require("ytdl-core");
const fetch = require("node-fetch");
const fs = require("fs");
const token = fs.readFileSync("./token2.txt", "utf-8");
const pageTokens = fs.readFileSync("pageTokens.json");
const pageTokensParse = JSON.parse(pageTokens);
let pageTokensParseCounter = 0;
const searchSpotify = require("./searchSpotify.js");
const addTrackToSpotify = require("./addToSpotify.js");
const spotifyArray = require("./checkDupSpot");
const chalk = require("chalk");
let final = false;
const filterSym = [
  ".",
  ",",
  "!",
  "/",
  "(",
  ")",
  "{",
  "}",
  "?",
  "[",
  "]",
  "-",
  "_",
  ":",
  ";",
  "official",
  "video",
  "music",
  "ft",
  "feat",
  "*",
  "^",
  "|",
  "hd",
  "lyric",
  "lyrics",
  "~",
];

////////////////////////////////////////////////////////////////////////////////

let endpoint = `https://youtube.googleapis.com/youtube/v3/playlistItems?part=snippet%2CcontentDetails&maxResults=50&playlistId=${process.env.YT_PLAYLIST}&key=${process.env.API_YT}`;

async function getdata(link) {
  const promise = new Promise((resolve, reject) => {
    ytdl
      .getBasicInfo(`https://www.youtube.com/watch?v=${link}`)
      .then((res) => {
        const song = res.videoDetails.media.song;
        console.log(
          chalk.italic.cyan(
            `
        ${song}
        `
          )
        );
        const artist = res.videoDetails.media.artist;
        const combo = `${song} ${artist}`;
        let arrayFromYt = combo.split("");
        let filteredArray = arrayFromYt.filter((sym) => {
          return !filterSym.includes(sym);
        });
        let titleDone3 = filteredArray.join("");
        let test2 = titleDone3.split(" ");
        let finalTitle = test2.filter((sym) => {
          return !filterSym.includes(sym);
        });
        const titleDone = finalTitle.join(" ");
        console.log(
          `
Encoding the title to a friendly URL encoding for Spotify`
        );
        const uriEncode = encodeURIComponent(titleDone.toLowerCase());

        resolve(uriEncode);
      })
      .catch((err) => {
        console.log(err.message);
        resolve();
      });
  });
  return await promise;
}

async function package(x) {
  const ee = await x;
  const SpotifyMusicID = await searchSpotify(token, ee);
  if (spotifyArray.spotifyArray.includes(SpotifyMusicID)) {
    console.log(
      chalk.yellow(
        `
It's in the list already
---------------------------------------------------------
`
      )
    );
  } else {
    const addMusicTospot = await addTrackToSpotify(SpotifyMusicID, token);
    addMusicTospot;
  }
}

////////////////////////////////////////////////////////////////////////////////

async function youtubeDL(counterID) {
  if (counterID <= 49) {
    console.log(
      `
Checking what's saved on the ${counterID} position in the playlist. 
`
    );
    try {
      let response = await fetch(endpoint);
      if (response.ok) {
        let data = await response.json();
        if (data.pageInfo.totalResults === counterID) {
          console.log(`Nothing on the ${counterID} position.`);
          final = true;
          module.exports.final = final;
        } else {
          let linkID = data.items[counterID].contentDetails.videoId;
          const x = getdata(linkID).then((res) => {
            return res;
          });
          await package(x);
        }
      }
    } catch (error) {
      console.log(error);
    }
  } else if (counterID > 50) {
    console.log(
      `
Checking what's saved on the ${counterID - 50} position in the playlist.
`
    );

    try {
      let response = await fetch(
        endpoint + "&pageToken=" + pageTokensParse[pageTokensParseCounter]
      );
      if (response.ok) {
        let data = await response.json();
        let dynaCounterId = counterID - 50 * (pageTokensParseCounter + 1);

        let lastKey =
          pageTokensParse[
            Object.keys(pageTokensParse)[
              Object.keys(pageTokensParse).length - 1
            ]
          ];

        if (
          data.items.length === dynaCounterId &&
          pageTokensParse[pageTokensParseCounter] === lastKey
        ) {
          console.log(`Nothing on the ${counterID - 50} position.`);
          final = true;
          module.exports.final = final;
        } else if (data.items.length > dynaCounterId) {
          let linkID = data.items[dynaCounterId].contentDetails.videoId;
          const y = getdata(linkID).then((res) => {
            return res;
          });
          await package(y);
        } else {
          const waitFor = (delay) =>
            new Promise((resolve) => setTimeout(resolve, delay));
          pageTokensParseCounter += 1;

          try {
            let response = await fetch(
              endpoint + "&pageToken=" + pageTokensParse[pageTokensParseCounter]
            );
            if (response.ok) {
              let data = await response.json();
              let linkID = data.items[0].contentDetails.videoId;
              const y = getdata(linkID).then((res) => {
                return res;
              });
              package(y);
              let linkID2 = data.items[1].contentDetails.videoId;
              const u = getdata(linkID2).then((res) => {
                return res;
              });
              package(u);
            }
          } catch (error) {
            console.log(error);
          }
          await waitFor(6000);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = youtubeDL;
module.exports.final = final;
