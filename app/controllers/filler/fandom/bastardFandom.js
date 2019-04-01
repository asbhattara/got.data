const mongoose = require('mongoose'),
      Bastards = require('../../../models/fandom/bastard'),
      BastardsScraper = require('../../scraper/fandom/bastard');


class BastardsFandomFiller {
    constructor() {
        this.scraper = new BastardsScraper();
    }

    async fill() {
        try {
            // start scraping
            let data = await this.scraper.getAllBastards();
            // clear collection
            await this.clearAll();
            // match scraped data to model
            data = await this.matchToModel(data);

            console.log(data.length);
            // add to DB
            await this.insertToDb(data);
        } catch (error) {
            console.warn(error);
        }
    }

    // remove collection
    async clearAll() {
        console.log('clearing collection...')
        Bastards.deleteMany({}, (err, data) => {
            if (err) {
                console.warn('error in removing collection: ' + err);
            } else {
                console.log('Collection successfully removed');
            }
        });
        return;
    }
    // match attributes from Scraper to Mongoose Schema
    async matchToModel(bastards) {
        console.log('formating and saving scraped data to DB... this may take a few seconds');
        bastards.map(bastard => {
            let newEp = new Bastards();
            for(let attr in bastard) {
                newEp[attr] = bastard[attr];
            }
            return newEp;
        });

        
        return bastards.filter(bastard => bastard['name']);
    }

    async insertToDb(data) {
        Bastards.insertMany(data, (err, docs) => {
            if (err) {
                console.warn('error in saving to db: ' + err);
                return;
            } 
            console.log(docs.length + ' bastards successfully saved to MongoDB!');
        });
        return;
    }
}
module.exports = BastardsFandomFiller;
