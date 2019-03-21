(function () {
    // compatibility file
    const scraper = require("./westeros/cultures");
    const scraperinstance = new scraper();

    module.exports = {
        getAll: function (callback) {
            scraperinstance.getAll().then(callback, function () {
                callback([])
            });
        },

        scrapToFile: function (cacheFile, scraperFunction, callback) {
            scraperinstance.scrapToFile(cacheFile, scraperFunction, callback);
        }
    };
}());