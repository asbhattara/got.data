(function () {
    // compatibility file
    const scraper = require("./westeros/ages");

    module.exports = {
        getAll: function (callback) {
            scraper.getAll().then(callback, function () {
                callback([])
            });
        },

        getAllWithEvents: function (callback) {
            scraper.getAllWithEvents().then(callback, function () {
                callback([])
            });
        },

        scrapToFile: function (cacheFile, scraperFunction, callback) {
            scraper.scrapToFile(cacheFile, scraperFunction, callback);
        }
    };
}());