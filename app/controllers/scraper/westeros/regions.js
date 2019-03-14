const MWBot = require('mwbot');
const cheerio = require('cheerio');
const Scraper = require("../scraper");

class RegionScraper extends Scraper {
    constructor()
    {
        super();

        this.bot = new MWBot({
            apiUrl: 'https://awoiaf.westeros.org/api.php'
        });
    }

    async getAllNames() {
        console.log("start getRegions");

        let regions = [];

        regions.push(...(await this.getWesteros()));
        regions.push(...(await this.getEssos()));
        regions.push(...(await this.getSothoryos()));

        return regions;
    }

    async getAll() {
        let regions = await this.getAllNames();
        let regionsCollection = [];

        for(let i = 0; i < regions.length; i++) {
            let region = await this.get(regions[i]);

            if(region) {
                regionsCollection.push(region);
            }

            console.log("Still " + (regions.length - regionsCollection.length) + " regions to fetch.");
        }

        return regionsCollection;
    }

    async get(regionName) {
        if(!regionName){
            console.log("Skipped: "+regionName);
            return ;
        }

        console.log("Fetching " + regionName);

        let pageName = regionName.replace(/\s/g, "_");
        let data;

        try {
            data = await this.bot.request({
                action: "parse",
                page: pageName,
                format: "json",
                redirects: ""
            });
        }
        catch (e) {
            console.log(e);

            return null;
        }

        let region = {};

        if(data !== null && data !== undefined) {
            if(data.parse.redirects.length > 0) {
                regionName = data.parse.redirects[0].to;
            }
        }

        region.name = regionName;

        return region
    }

    async getWesteros() {

        console.log("start getRegions");
        //Setup the mediawiki bot

        let data = await this.bot.request({
            action: "parse",
            page: "Westeros",
            format: "json",
            redirects: ""
        });

        //Iterate through all Regions    toctitle

        //console.log("Loading all regions from the wiki. This might take a while");
        let $ = cheerio.load(data.parse.text["*"]);

        let contents = $('.toc li');

        let check = contents.html();

        check = check.split('<ul>');

        check = check[1].replace('/<(.|\n)*?>/g','');

        check = check.replace(/\*?<(?:.|\n)*?>/gm, '').trim();

        check = check.replace(/\d+/g, '');
        check = check.replace(/\./g, '');

        check = check.split('\n');

        for(let i = 0; i < check.length; i++)
        {
            check[i] = decodeURIComponent(String(check[i]).trim());
        }

        return check;
    }
    
    async getEssos() {

        console.log("start getRegions");
        //Setup the mediawiki bot

        let data = await this.bot.request({
            action: "parse",
            page: "Essos",
            format: "json",
            redirects: ""
        });

        //Iterate through all Regions    toctitle
        //console.log("Loading all regions from the wiki. This might take a while");

        let $ = cheerio.load(data.parse.text["*"]);

        let contents = $('ul ul');

        let check = contents.html();

        check = check.replace(/\*?<(?:.|\n)*?>/gm, '').trim();

        check = check.replace(/\d+/g, '');
        check = check.replace(/\./g, '');

        check = check.split('\n');

        for(let i = 0; i < check.length; i++)
        {
            check[i] = decodeURIComponent(String(check[i]).trim());
        }

        return check;
    }

    async getSothoryos() {
        console.log("start getRegions");

        return ['Naath','Isle of Tears','Basilisk Point'];
    }
}

module.exports = new RegionScraper();