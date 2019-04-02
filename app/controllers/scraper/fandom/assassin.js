const MWBot = require('mwbot');
const cheerio = require('cheerio');
const rp = require('request-promise');

class AssassinScrapper {
    constructor() {
        this.bot = new MWBot({
            apiUrl: 'https://gameofthrones.fandom.com/api.php'
        });
    }

    async getAllAssassin() {

        let options = {
            uri: 'https://gameofthrones.fandom.com/wiki/Category:Assassins',
            transform: function (body) {
                return cheerio.load(body);
            }
        };

        let assassins = [];
        await rp(options)
            .then(function ($) {
                // Process html like you would with jQuery...

                $('li[class=category-page__member]').each(function (index) {
                    let assassin = {"name": null};
                    assassin.name = $(this).children('a').attr('title')
                    // console.log(assassin);

                    if(!assassin.name.match(/Category/g)) {
                        assassins.push(assassin);
                    }

                });

            })
            .catch(function (err) {
            });


        return assassins;

    }
}


module.exports = AssassinScrapper;