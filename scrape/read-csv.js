import csv from 'csvtojson';

const csvPath = './scrape/data.csv';

csv()
.fromFile(csvPath)
.then((jsonObj) => {
    console.log(jsonObj);
    /**
     * [
     * 	{a:"1", b:"2", c:"3"},
     * 	{a:"4", b:"5". c:"6"}
     * ]
     */
});
