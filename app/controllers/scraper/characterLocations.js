(function () {
    // compatibility file
    const scraper = require("./westeros/characterLocations");
    const scraperinstance = new scraper();

    module.exports = {
        getAll: function (callback) {
            scraperinstance.getAll().then(callback, function () {
                callback([])
            });
        },

        get: function (characterName, locationNames, callback) {
            scraperinstance.get(characterName, locationNames).then(callback, function () {
                callback([])
            });
        },

        scrapToFile: function (cacheFile, scraperFunction, callback) {
            scraperinstance.scrapToFile(cacheFile, scraperFunction, callback);
        }
    };
}());