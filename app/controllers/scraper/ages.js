(function () {
    // compatibility file
    const scraper = require("./westeros/ages");
    const scraperinstance = new scraper();

    module.exports = {
        getAll: function (callback) {
            scraperinstance.getAll().then(callback, function () {
                callback([])
            });
        },

        getAllWithEvents: function (callback) {
            scraperinstance.getAllWithEvents().then(callback, function () {
                callback([])
            });
        },

        scrapToFile: function (cacheFile, scraperFunction, callback) {
            scraperinstance.scrapToFile(cacheFile, scraperFunction, callback);
        }
    };
}());