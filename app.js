require("dotenv").config;
const checkYt = require("./ytajax.js");
const searchSpotify = require("./searchSpotify.js");
const addTrackToSpotify = require("./addToSpotify.js");
const youtubeDL = require("./dl.js");
const readSpotifyList = require("./checkDupSpot.js");
const spotifyArray = require("./checkDupSpot");
const fs = require("fs");
const token = fs.readFileSync("./token2.txt", "utf-8");
const chalk = require("chalk");

let counterID = 0;
let counterID2 = 0;

async function getMusic2() {
  await readSpotifyList(token);
  if (checkYt.keepGoing2) {
    const ytQuery = await checkYt(counterID);
    const SpotifyMusicID = await searchSpotify(token, ytQuery);
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
    counterID++;
  } else if (checkYt.keepGoing && !youtubeDL.final) {
    youtubeDL(counterID2);
    counterID2++;
  } else if (youtubeDL.final) {
    console.log(chalk.green.bold("Done! Stopping the script."));
    process.exit();
  }
}

setInterval(getMusic2, 2500);
//getMusic2();
