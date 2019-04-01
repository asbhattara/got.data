class Scraper {
    scrapToFile (cacheFile, scraperFunction, callback) {
        console.log('Scrapping from wiki. May take a while..');
        scraperFunction(function (data) {
            data = {'data': data, createdAt: new Date()};
            console.log('Writing results into cache file "' + cacheFile + '"..');
            jsonfile.writeFile(cacheFile, data, function (err) {
                callback(err, data);
            });
        });
    }
}

module.exports = Scraper;