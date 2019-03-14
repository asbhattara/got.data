(function () {
    // compatibility file
    const scraper = require("./westeros/characterLocations");

    module.exports = {
        getAll: function (callback) {
            scraper.getAll().then(callback, function () {
                callback([])
            });
        },

        get: function (characterName, locationNames, callback) {
            scraper.get(characterName, locationNames).then(callback, function () {
                callback([])
            });
        },

        scrapToFile: function (cacheFile, scraperFunction, callback) {
            scraper.scrapToFile(cacheFile, scraperFunction, callback);
        }
    };
}());