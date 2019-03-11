(function () {
    "use strict";
    var bot = require("nodemw");
    var client = new bot({
        server: "awoiaf.westeros.org",
        path: "/api.php",
        concurrency: "5"
    });
    var jsonfile = require('jsonfile');

    var HtmlParser = require('cheerio');
    var async = require('async');

    module.exports = {
        get: function (regionName, callback) {
			
			if(!regionName){
                console.log("Skipped: "+regionName);
                return ;
            }

            console.log("Fetching " + regionName);

            var pageName = regionName.replace(/\s/g, "_");

            var params = {
                action: "parse",
                page: pageName,
                format: "json",
				redirects: ""
            };
			
			var region = {};
			
			client.api.call(params, function (err, info, next, data) {
                if(data !== null && data !== undefined) {
					if(data.parse.redirects.length > 0) {
						regionName = data.parse.redirects[0].to;
					}
				}
				
				region.name = regionName;
				
                callback(region);

            });
			
        },

        getAllNames: function (callback) {
            console.log("start getRegions");
            //Setup the mediawiki bot

            var params = {
                action: "parse",
                page: "Westeros",
                format: "json",
				redirects: ""
            };

            var regions = [];


            this.getWesteros(function(region) {
                console.log(region);
                regions.push(region);
            });

             this.getEssos(function(region) {
                console.log(region);
                regions.push(region);
            });

             this.getSothoryos(function(region) {
                console.log(region);
                regions.push(region);
            });

            setTimeout(function() {
                callback(regions);
            }, 9000);

            

        },

        getWesteros: function (callback) {

            console.log("start getRegions");
            //Setup the mediawiki bot

            var params = {
                action: "parse",
                page: "Westeros",
                format: "json",
                redirects: ""
            };

            var regions = [];

            //Iterate through all Regions    toctitle

            //console.log("Loading all regions from the wiki. This might take a while");
            client.api.call(params, function (err, info, next, data) {

                var $ = HtmlParser.load(data.parse.text["*"]);
                
                var contents = $('.toc li');

                var check = contents.html();

                check = check.split('<ul>');
                
                check = check[1].replace('/<(.|\n)*?>/g','');
                
                check = check.replace(/\*?<(?:.|\n)*?>/gm, '').trim();

                check = check.replace(/\d+/g, '');
                check = check.replace(/\./g, '');

                check = check.split('\n');

                check.forEach(function(element) {
                    callback(element);
                });

                
                

            });

        },

        getEssos: function (callback) {

            console.log("start getRegions");
            //Setup the mediawiki bot

            var params = {
                action: "parse",
                page: "Essos",
                format: "json",
                redirects: ""
            };

            var regions = [];

            //Iterate through all Regions    toctitle

            //console.log("Loading all regions from the wiki. This might take a while");
            client.api.call(params, function (err, info, next, data) {

                var $ = HtmlParser.load(data.parse.text["*"]);
                
                var contents = $('ul ul');

                var check = contents.html();

                
                check = check.replace(/\*?<(?:.|\n)*?>/gm, '').trim();

                check = check.replace(/\d+/g, '');
                check = check.replace(/\./g, '');

                check = check.split('\n');


                check.forEach(function(element) {
                    callback(element);
                });

            });

        },

        getSothoryos: function (callback) {

            console.log("start getRegions");
            //Setup the mediawiki bot

            var check = ['Naath','Isle of Tears','Basilisk Point'];

            check.forEach(function(element) {
                    callback(element);
                });

        },

		
		getAll: async function (callback) {
            var scraper = require("./regions");
            scraper.getAllNames(function (regions) {

                var regionsCollection = [];
                var saveReg = function (region) {
                    regionsCollection.push(region);
                    console.log("Still " + (regions.length - regionsCollection.length) + " regions to fetch.");
                    if (regionsCollection.length == regions.length) {
                        callback(regionsCollection);
                    }
                };

                for (let i = 0; i < regions.length; i++) {
                    scraper.get(regions[i], saveReg);
                }
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