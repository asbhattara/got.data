(function () {
    // compatibility file
    const scraper = require("./westeros/characters");

    module.exports = {
        getAllNames: function (callback) {
            scraper.getAllNames().then(callback, function () {
                callback([])
            });
        },

        getAll: function (callback) {
            scraper.getAll().then(callback, function () {
                callback([])
            });
        },

        get: function (characterName, callback) {
            scraper.get(characterName).then(callback, function () {
                callback([])
            });
        },

        scrapToFile: function (cacheFile, scraperFunction, callback) {
            scraper.scrapToFile(cacheFile, scraperFunction, callback);
        }
    };
}());