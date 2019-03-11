(function () {
    // compatibility file
    let HouseScraper = require("./app/controllers/westeros/houses");
    let jsonfile = require('jsonfile');

    let scraper = new HouseScraper();

    module.exports = {
        /*
         * Returns a list of house names
         */
        getAllNames: function (callback) {
            scraper.getAllNames().then(callback, function () {
                callback([])
            });
        },
        /*
         * Call when you want to fetch all house information
         */
        getAll: function (callback) {
            scraper.scrapeAll().then(callback, function () {
                callback([])
            });
        },

        /*
         * Fetches details for one house
         */
        get: function (houseName, callback) {
            scraper.scrape(houseName, houseName).then(callback, function () {
                callback([])
            });
        },
        scrapToFile: function (cacheFile, scraperFunction, callback) {
            console.log('Scrapping from wiki. May take a while..');
            scraperFunction(function (data) {
                data = {'data': data, createdAt: new Date()};
                console.log('Writing results into cache file "' + cacheFile + '"..');
                jsonfile.writeFile(cacheFile, data, function (err) {
                    callback(err, data);
                });
            });
        }
    };
}());