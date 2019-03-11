(function () {
    "use strict";
    var bot = require("nodemw");
    var client = new bot({
        server: "awoiaf.westeros.org",
        path: "/api.php",
        concurrency: "5"
    });
    var jsonfile = require('jsonfile');

    module.exports = {
        getAll: function (callback) {
            console.log("start getAll");

            var params = {
                action: "parse",
                page: "Portal:Culture",
                format: "json"
            };

            

            client.api.call(params, function (err, info, next, data) {

                var cultures = [];

                var allData = data.parse.text["*"];
                var result = allData.match(/<tr>(.|\n)*?<\/tr>/g);

                var listForSevenKingdomsAndAncientTimes, listForBeyondTheWallAndEssos;

                listForSevenKingdomsAndAncientTimes = result[3].match(/title="([^"]*)"/g);
                listForBeyondTheWallAndEssos = result[5].match(/title="([^"]*)"/g);

                for (var i = 0; i < listForSevenKingdomsAndAncientTimes.length; i++) {
                    let culture = {};
                    listForSevenKingdomsAndAncientTimes[i] = listForSevenKingdomsAndAncientTimes[i].replace(/title=/g, '');
                    listForSevenKingdomsAndAncientTimes[i] = listForSevenKingdomsAndAncientTimes[i].replace(/"/g, '');
                    culture.name = listForSevenKingdomsAndAncientTimes[i];
                    cultures.push(culture);
                }

                for (var i = 0; i < listForBeyondTheWallAndEssos.length; i++) {
                    let culture = {};
                    listForBeyondTheWallAndEssos[i] = listForBeyondTheWallAndEssos[i].replace(/title=/g, '');
                    listForBeyondTheWallAndEssos[i] = listForBeyondTheWallAndEssos[i].replace(/"/g, '');
                    culture.name = listForBeyondTheWallAndEssos[i];
                    cultures.push(culture);
                }


                callback(cultures);

                
            });

        },



        scrapToFile: function (cacheFile, scraperFunction, callback) {
            console.log('Scrapping from wiki. May take a while..');
            scraperFunction(function (data) {
                data = {'data': data, createdAt: new Date()};
                console.log('Writing results into cache file "' + cacheFile + '"..');
                jsonfile.writeFile(cacheFile, data, function (err) {
                    callback(err, data);
                });
            });
        }
    };
}());