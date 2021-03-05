const fetch = require("node-fetch");
require("dotenv").config();
const fs = require("fs");

async function getPageTokens() {
  let endpointYtPagination = `https://youtube.googleapis.com/youtube/v3/playlistItems?part=snippet%2CcontentDetails&maxResults=50&playlistId=${process.env.YT_PLAYLIST}&key=${process.env.API_YT}`;

  let pageTokenArrary = [];
  try {
    let responseYtPagination = await fetch(endpointYtPagination);
    if (responseYtPagination.ok) {
      let dataYtPagination = await responseYtPagination.json();
      pageTokenArrary.push(dataYtPagination.nextPageToken);
      let antallFullesider = Math.floor(
        dataYtPagination.pageInfo.totalResults / 50
      );
      let i = 0;
      while (i < antallFullesider) {
        try {
          let nextPageToken = await fetch(
            `${endpointYtPagination}&pageToken=${pageTokenArrary[i]}`
          );
          if (nextPageToken.ok) {
            let tokenDataYtPagination = await nextPageToken.json();
            pageTokenArrary.push(tokenDataYtPagination.nextPageToken);
            i++;
          }
        } catch (error) {
          console.log(error);
        }
      }
      pageTokenArrary.pop();
      const pageTokens = Object.assign({}, pageTokenArrary);
      PageTokenJSON = JSON.stringify(pageTokens);
      fs.writeFileSync("pageTokens.json", PageTokenJSON, null, 2);
      console.log("pageTokens.json file generated.");
    } else {
      console.log("error");
    }
  } catch (error) {
    console.log(error);
  }
}
module.exports = getPageTokens;
