const MWBot = require('mwbot');
const cheerio = require('cheerio');
const rp = require('request-promise');

class TownScrapper {
    constructor() {
        this.bot = new MWBot({
            apiUrl: 'https://gameofthrones.fandom.com/api.php'
        });
    }

    async getAllTownsRaw() {

        var options = {
            uri: 'https://gameofthrones.fandom.com/wiki/Category:Towns',
            transform: function (body) {
                return cheerio.load(body);
            }
        };

        var towns = []
        await rp(options)
            .then(function ($) {
                // Process html like you would with jQuery...
                
                $('li[class=category-page__member]').each(function( index ) {
                    var town = {"title": null, "reference": null};
                    town.title = $(this).children('a').attr('title')
                    town.reference = $(this).children('a').attr('href')
                    // console.log(town.title);

                    if(!town.title.match(/Category/g)) {
                        towns.push(town);
                    }
                  
                });

            })
            .catch(function (err) {
            });

            // console.log(towns);

            return towns;

    }

    async scrape(town) {
        let data = null;
        try {
            data = await this.bot.request({
                action: "parse",
                format: "json",
                page: decodeURIComponent(town.reference.substr(6))
            });
        } catch (err) {
            return false;
        }

        var townItem = {};

        townItem.name = town.title;

        const $ = cheerio.load(data["parse"]["text"]["*"]);

        let $infobox = $(".portable-infobox");

        if($('div[data-source=Location]') != null) {
            townItem.location = $('div[data-source=Location]').find(".pi-data-value").text().replace(/\[\d+\]+/g, '').replace(/&apos;/g,"'").replace(/&amp;/g,"&").replace(/\([^()]*\)/g, '').replace(/&#x2020;/g,"&").replace(/[,].*/g, '');
        }

        if($('div[data-source=Type]') != null) {
            townItem.type = $('div[data-source=Type]').find(".pi-data-value").text().replace(/\[\d+\]+/g, '').replace(/&apos;/g,"'").replace(/&amp;/g,"&").replace(/\([^()]*\)/g, '').replace(/&#x2020;/g,"&");
        }

        townItem.rulers = []

        if($('div[data-source=Rulers]') != null) {
            var rulers = $('div[data-source=Rulers]').find(".pi-data-value").html()

            if(rulers != null) {
                rulers = rulers.match(/title="(.*?)"/g);

                if(rulers) {
                    rulers.forEach(function(element) {
                    var el = element.replace(/title=/g,'').replace(/"/g,'');
                    townItem.rulers.push(el);
                });
                }

                
            }
        }

        townItem.religion = []

        if($('div[data-source=Religion]') != null) {

            var religion = $('div[data-source=Religion]').find(".pi-data-value").html()

            if(religion != null) {
                religion = religion.match(/title="(.*?)"/g);

                religion.forEach(function(element) {
                    var el = element.replace(/title=/g,'').replace(/"/g,'');
                    townItem.religion.push(el);
                });
            }

            

        }

        return townItem;
    }

    async scrapeAll() {
        let towns = await this.getAllTownsRaw();
        let data = [];

        for(let i = 0; i < towns.length; i++) {
            console.log("started scraping ", towns[i]);
            let e = await this.scrape(towns[i]);

            // console.log(e);

            if (e)
                data.push(e);
            else
                console.log("invalid page");
        }
        
        
        return data;
    }
}


module.exports = TownScrapper;