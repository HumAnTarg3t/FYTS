require("dotenv").config();
const fetch = require("node-fetch");
const fs = require("fs");
const token = fs.readFileSync("./token2.txt", "utf-8");
const pageTokens = fs.readFileSync("pageTokens.json");
const sleep = require("util").promisify(setTimeout);
const searchSpotify = require("./searchSpotify.js");
const addTrackToSpotify = require("./addToSpotify.js");
const spotifyArray = require("./checkDupSpot");
const pageTokensParse = JSON.parse(pageTokens);
const chalk = require("chalk");

let pageTokensParseCounter = 0;
let keepGoing = false;
let keepGoing2 = true;

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

let endpoint = `https://youtube.googleapis.com/youtube/v3/playlistItems?part=snippet%2CcontentDetails&maxResults=50&playlistId=${process.env.YT_PLAYLIST}&key=${process.env.API_YT}`;

async function checkYt(counterID) {
  if (counterID <= 49) {
    console.log(
      `
Checking what's saved on the ${counterID} position in the playlist.`
    );
    try {
      let response = await fetch(endpoint);
      if (response.ok) {
        let data = await response.json();
        if (data.pageInfo.totalResults <= counterID) {
          console.log("Switching to Youtube-DL");
          keepGoing = true;
          keepGoing2 = false;
          await spotifyArray(token);
          module.exports.keepGoing = keepGoing;
          module.exports.keepGoing2 = keepGoing2;
          return;
        } else {
          console.log(
            chalk.italic.cyan(`${data.items[counterID].snippet.title}`)
          );
          const title = data.items[counterID].snippet.title.toLowerCase();
          let arrayFromYt = title.split("");
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

          return uriEncode;
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
          keepGoing = true;
          keepGoing2 = false;
          await spotifyArray(token);
          module.exports.keepGoing = keepGoing;
          module.exports.keepGoing2 = keepGoing2;
          return;
        } else if (data.items.length >= dynaCounterId) {
          let title = data.items[dynaCounterId].snippet.title.toLowerCase();
          console.log(chalk.cyan(title));
          let arrayFromYt = title.split("");
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
          return uriEncode;
        } else {
          pageTokensParseCounter += 1;
          try {
            let response = await fetch(
              endpoint + "&pageToken=" + pageTokensParse[pageTokensParseCounter]
            );
            if (response.ok) {
              let data = await response.json();
              async function tes1(num) {
                console.log(data.items[num].snippet.title);
                let title = data.items[num].snippet.title.toLowerCase();
                let arrayFromYt = title.split("");
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

                const SpotifyMusicID = await searchSpotify(token, uriEncode);

                if (spotifyArray.spotifyArray.includes(SpotifyMusicID)) {
                  console.log(
                    chalk.yellow(
                      `
It's in the list already
---------------------------------------------------------
`
                    )
                  );
                } else if (
                  !spotifyArray.spotifyArray.includes(SpotifyMusicID)
                ) {
                  const addMusicTospot = await addTrackToSpotify(
                    SpotifyMusicID,
                    token
                  );
                  addMusicTospot;
                }
                await sleep(2000);
              }
              tes1(0);
              tes1(1);
            }
          } catch (error) {
            console.log(error);
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
}

//checkYt(0)
module.exports = checkYt;
module.exports.keepGoing = keepGoing;
module.exports.keepGoing2 = keepGoing2;
