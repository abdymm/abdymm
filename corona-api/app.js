const express = require("express");
const app = express();
const fs = require("fs");
const axios = require("axios");
const cheerio = require("cheerio");
const port = 3000;

const url = "https://www.worldometers.info/coronavirus";

let listOfCountry = [];
function fetchDetailUrl(resData) {
  console.log("URL: " + url);
  fetchData(url).then(res => {
    const html = res.data;
    const $ = cheerio.load(html);
    const rowOfCountry = $("table#main_table_countries_today tbody tr");
    rowOfCountry.each(function() {
      let country = $(this)
        .find("td")
        .eq(0)
        .text();
      let totalCases = $(this)
        .find("td")
        .eq(1)
        .text();
      let newCases = $(this)
        .find("td")
        .eq(2)
        .text();

      let totalDeaths = $(this)
        .find("td")
        .eq(3)
        .text();

      let newDeaths = $(this)
        .find("td")
        .eq(4)
        .text();

      let totalRecovered = $(this)
        .find("td")
        .eq(5)
        .text();
      let activeCases = $(this)
        .find("td")
        .eq(6)
        .text();
      let seriousCritical = $(this)
        .find("td")
        .eq(7)
        .text();
      let firstCaseAt = $(this)
        .find("td")
        .eq(10)
        .text();

      response = {
        country,
        totalCases,
        newCases,
        totalDeaths,
        newDeaths,
        totalRecovered,
        activeCases,
        seriousCritical,
        firstCaseAt
      };
      listOfCountry.push(response);
    });

    resData.json(listOfCountry);
  });
}
async function fetchData(url) {
  console.log("=================================");
  console.log("Crawl...");
  let response = await axios(url).catch(err => false);
  if (response.status !== 200) {
    return;
  }
  return response;
}

app.get("/corona", (req, res) => {
  fetchDetailUrl(res);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
