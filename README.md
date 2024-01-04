# MAYBE BE BROKE
Could be broken because of the version that are needed for it to run... not maintained

# From-youtube-to-spotify
 Takes your saved video from a public playlist in Youtube and adds it to Spotify.
 
## Table of contents
* [General info](#general-info)
* [Technologies](#technologies)
* [Prerequisite](#Prerequisite)
* [Installation](#Installation)
* [How to use](#How-to-use)
* [Features](#features)
* [Status](#status)
* [Inspiration](#inspiration)
* [Contact](#contact)
 
## General info
**Disclaimer!** _The youtube playlist must be PUBLIC or UNLISTED!_
 
FYTS(From-yt-to-spotify) was made with having in mind the idea to make it as automatic as possible.
It has 2 search engines:
The first one is from [ytdl-core](https://github.com/fent/node-ytdl-core) and the second one I made with [Youtube v3 API](https://developers.google.com/youtube/v3).
 
The whole process starts with the `node setup`. This starts a webserver to get
the spotify [Authorization Code(Authorization Flows)](https://developer.spotify.com/documentation/general/guides/authorization-guide/) so that the app gets access to edit private and public playlist. 
It gets the page tokens if your YT playlist has more than 50 videos and the same with Spotify.
 
**The authorization lasts 1 hour.** After it ends you need to run `node setup` again to get a new token for Spotify.
 
## Technologies
* JavaScript 
     * Node.js
     * Node-fetch
     * express
     * open
     * dotenv
     * ytdl-core
     * chalk
 
## Prerequisite
* **Youtube**
     * Getting the API KEY for Youtube:
          * Get the [Youtube v3 API Key](https://console.developers.google.com/)
               * Log in with your google account.
               * Create a New Project
                    * `Project name` cannot be changed later and is required.
                    * Location should be `No organization` and it’s required.
                    * Press `Create`
               * Be sure it says your project name in the top left corner where it says `GoogleAPIs`
               * Press `ENABLE APIS AND SERVICES`
               * Scroll down until you find `Youtube Data API v3`, then press it.
               * Press `ENABLE`
               * Not to the top left it should say `Credentials`, press it.
               * Now press `+ CREATE CREDENTIALS`
                    * Choose `API key`
                    * Press `Close`
               * Now copy the API key into the `.env_sample` file
     * Getting the youtube playlist
          * Find a public or unlisted playlist and copy the Playlist ID:
          Example:
          `https://www.youtube.com/playlist?list=PLOvPYnvXaMfW6DwxDm2UkkOt9EyJ9bflc`
          `PLOvPYnvXaMfW6DwxDm2UkkOt9EyJ9bflc` <-- paste this in the `.env_sample`
* **Spotify**
     * Get the Spotify Client ID and Spotify Client Secret from [Spotify Api](https://developer.spotify.com/dashboard/).
          * Login in with your normal spotify account
          * Press "Create an App"
          * Fill out the form
          * Press `Edit settings` and fill in the `Redirect URIs` with `http://localhost:8888/callback` and save at the bottom
          * Copy the `Client ID` and `Client Secret` and paste it in the `.env_sample` file
     * Getting the Spotify Playlist
          * `Right click ` the playlist you want to use --> `Share` -->`Copy Spotify URI` 
          Example:
          `spotify:playlist:5pteuqelkfSGvStD7CACwq`
          `5pteuqelkfSGvStD7CACwq` <-- paste this in the `.env_sample`
* **.env_sample**
     * Rename this from `.env_sample` to `.env`
 
## Installation
* `git clone https://github.com/HumAnTarg3t/FYTS.git`
* `cd FYTS`
* `npm install`
 
## How to use
* There are 3 parts for the script:
     * The 1. is to finish the [Prerequisite](#Prerequisite). You only need to do this one time, unless you want to change a Youtube or Spotify playlist.
     * The 2. is to run `node setup` inside the `FYTS` directory. (Read more here about [setup.js](#general-info))
     * The 3. step is to run `node app` inside the `FYTS` directory. This will start the actual process `From-youtube-to-spotify`.
 
## Features
List of features ready and TODOs for future development:
* Searches for a given **PUBLIC or UNLISTED** playlist in Youtube and then converts the video title (+ song name and artist if found) to a string so that Spotify can search for the song and add it to a given Spotify playlist.
 
To-do list:

[X] Make so that it changes the pages, max 50 results per page in Youtube and max 100
in Spotify.

[X] Gets metadata(name and artist) from Youtube([ytdl-core](https://github.com/fent/node-ytdl-core)).

[] Make a new main.js for user choices.

[X] Check for duplicates in spotify list(there are none official "remove duplicates" from spotify WEB API).

[] Getting Youtube OAuth for private videos.

[] Put in a login for youtube-DL for private videos.

[] Merge the 2 search engines so that it uses 1/2 the time.

[X] Add color to the terminal ([chalk](https://github.com/chalk/chalk))
 
## Issues
If the video is not found with [Youtube v3 API](https://developers.google.com/youtube/v3) it will get the response as "undefined" and that will (as intended) go with the flow into the `searchSpotify.js` and will come out as `spotify:track:3l3Wh4KRKll7nFdpCFfDe5` = `Undefined - William Ryan Fritch`.
The same is with [ytdl-core](https://github.com/fent/node-ytdl-core) if it finds a deleted video: `spotify:track:1AxMfxInItZG8zfS1tONZS` = `Deleted - Reavv`.
 
 
## Status
Project is: _ongoing_
 
## Inspiration
The urge for learning.
 
## Contact
Created by [@HumAnTarg3t](https://github.com/HumAnTarg3t)
 
 

