(function () {
    // compatibility file
    const scraper = require("./westeros/houses");
    const scraperinstance = new scraper();

    module.exports = {
        /*
         * Returns a list of house names
         */
        getAllNames: function (callback) {
            scraperinstance.getAllNames().then(callback, function () {
                callback([])
            });
        },
        /*
         * Call when you want to fetch all house information
         */
        getAll: function (callback) {
            scraperinstance.getAll().then(callback, function () {
                callback([])
            });
        },

        /*
         * Fetches details for one house
         */
        get: function (houseName, callback) {
            scraperinstance.get(houseName, houseName).then(callback, function () {
                callback([])
            });
        },

        scrapToFile: function (cacheFile, scraperFunction, callback) {
            scraperinstance.scrapToFile(cacheFile, scraperFunction, callback);
        }
    };
}());