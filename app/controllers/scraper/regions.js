(function () {
    // compatibility file
    const scraper = require("./westeros/characters");
    const scraperinstance = new scraper();

    module.exports = {
        getAllNames: function (callback) {
            scraperinstance.getAllNames().then(callback, function () {
                callback([])
            });
        },

        getAll: function (callback) {
            scraperinstance.getAll().then(callback, function () {
                callback([])
            });
        },

        get: function (regionName, callback) {
            scraperinstance.get(regionName).then(callback, function () {
                callback([])
            });
        },

        scrapToFile: function (cacheFile, scraperFunction, callback) {
            scraperinstance.scrapToFile(cacheFile, scraperFunction, callback);
        }
    };
}());