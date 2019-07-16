// import tabletojson from 'tabletojson';
// var tabletojson = require('tabletojson');
// import cheerio from 'cheerio';
import axios from 'axios';
import cheerio from 'cheerio';
var htmlparser = require("htmlparser2");
let jsonframe = require('jsonframe-cheerio');

const urlMarineHarvest = 'https://www.avanza.se/aktier/om-aktien.html/52507/marine-harvest';

// console.log('tabletojson', tabletojson);

// tabletojson.convertUrl(
//   'https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes',
//   { stripHtmlFromCells: false },
//   function(tablesAsJson) {
//     //Print out the 1st row from the 2nd table on the above webpage as JSON
//     console.log(tablesAsJson[1][0]);
//   }
// );

// request(urlMarineHarvest, function (error, response, html) {
//   if (!error) {
//     const $ = cheerio.load(html)
//     const result = $(".ExRate-TR").map((i, element) => ({
//       currency: $(element).find('td:nth-of-type(1)').text().trim()
//      ,amount: $(element).find('td:nth-of-type(3)').text().trim()
//     })).get()
//     console.log(JSON.stringify(result))
//   }
// })

axios.get(urlMarineHarvest)
  .then(r => r.data)
  .then(d => {
    const $ = cheerio.load(d);

    const jsData = jsonframe($); // initializes the plugin
    // const gurka = $.find('.dividends');

    // const result = $(".ExRate-TR").map((i, element) => ({
    //   currency: $(element).find('td:nth-of-type(1)').text().trim()
    //  ,amount: $(element).find('td:nth-of-type(3)').text().trim()
    // })).get();

    // console.log('gurka', gurka);
    // console.log(JSON.stringify(result))
    console.log('jsData', jsData);
  });
