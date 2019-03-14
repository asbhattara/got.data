(function () {
    // compatibility file
    const scraper = require("./westeros/houses");

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
            scraper.getAll().then(callback, function () {
                callback([])
            });
        },

        /*
         * Fetches details for one house
         */
        get: function (houseName, callback) {
            scraper.get(houseName, houseName).then(callback, function () {
                callback([])
            });
        },

        scrapToFile: function (cacheFile, scraperFunction, callback) {
            scraper.scrapToFile(cacheFile, scraperFunction, callback);
        }
    };
}());