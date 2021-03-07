require("dotenv").config();
const fs = require("fs");
const fetch = require("node-fetch");
const express = require("express");
const app = express();
const open = require("open");
const readSpotifyList = require("./checkDupSpot.js");
const ytPagination = require("./ytPagination");
const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const tokenLink = `https://accounts.spotify.com/authorize?client_id=${SPOTIFY_CLIENT_ID}&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A8888%2Fcallback&scope=playlist-modify-private`;

open("http://localhost:8888/");
app.get("/", (req, res) => {
  res.redirect(tokenLink);
});
//////////////////////////Her begynner 1/2 token////////////////////////////////////////////////////////////////
app.get("/callback*", async (req, res) => {
  let token = await req.query.code;
  console.log("Grabing the 1/2 token");

  fs.writeFile("./token1.txt", token, function (err) {
    if (err) {
      return console.log(err);
    }
  });

  await new Promise((resolve) => {
    console.log("Loading");
    setTimeout(resolve, 1000);
  });
  getSpotifyToken();
  res.send("You can close the browser now.");
});
//////////////////////////Her begynner 2/2 token////////////////////////////////////////////////////////////////
async function getSpotifyToken() {
  const endpoint = "https://accounts.spotify.com/api/token";
  console.log("Grabing the 2/2 token");
  let SpotifyCode = fs.readFileSync("./token1.txt", "utf-8");
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `grant_type=authorization_code&code=${SpotifyCode}&client_id=${SPOTIFY_CLIENT_ID}&client_secret=${SPOTIFY_CLIENT_SECRET}&redirect_uri=http%3A%2F%2Flocalhost%3A8888%2Fcallback`,
    });

    const data = await response.json();
    console.log("2/2 token grabbed");
    const tokenKEY = await data.access_token;

    fs.writeFile("./token2.txt", tokenKEY, function (err) {
      if (err) {
        return console.log(err);
      }
    });
    console.log("The token file was saved!");
    await readSpotifyList(tokenKEY);
    await ytPagination();

    process.exit();
  } catch (error) {
    console.log(error);
  }
}
const port = process.env.PORT || 8888
app.listen(port, () => {
  console.log("listening on 'http://localhost:8888'");
});
