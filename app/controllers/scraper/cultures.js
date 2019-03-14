(function () {
    // compatibility file
    const scraper = require("./westeros/cultures");

    module.exports = {
        getAll: function (callback) {
            scraper.getAll().then(callback, function () {
                callback([])
            });
        },

        scrapToFile: function (cacheFile, scraperFunction, callback) {
            scraper.scrapToFile(cacheFile, scraperFunction, callback);
        }
    };
}());