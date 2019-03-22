const mongoose = require('mongoose'),
      Religions = require('../../../models/fandom/religions'),
      ReligionScraper = require('../../../controllers/scraper/fandom/religions');


class ReligionFiller {
    constructor() {
        this.scraper = new ReligionScraper();
    }

    async fill() {
        try {
            // start scraping
            let data = await this.scraper.scrapeAll();

            // match scraped data to model
            data = await this.matchToModel(data);
            // add to DB
            await this.insertAll(data);
        } catch (error) {
            console.warn(error);
        }
    }

    // remove collection
    async clearAll() {
        console.log('clearing collection...')
        Religions.deleteMany({}, (err, data) => {
            if (err) {
                console.warn('error in removing collection: ' + err);
            } else {
                console.log('Collection successfully removed');
            }
        });
        return;
    }

    
    // match attributes from Scraper to Mongoose Schema
    async matchToModel(religions) {
        console.log('formating and saving scraped data to DB... this may take a few seconds');
        religions.map(religion => {
            let newRel = new Religions();
            for(let attr in religion) {
                // numbers sometimes return NaN which throws error in DB
                // if((attr == '') && isNaN(religion[attr])) {
                //     delete religion[attr];
                // } 
                newRel[attr] = religion[attr];
            }
            return newRel;
        });
        return religions.filter(religion => religion['name']);
    }

    async insertAll(data) {
        // clear collection
        await this.clearAll();
        try {
            Religions.insertMany(data, (err, docs) => {
                if (err) {
                    console.warn('error in saving to db: ' + err);
                    return;
                } 
                console.log(docs.length + ' religions successfully saved to MongoDB!');
            });
            return;
        } catch(e) {
            throw new Error(e);
        }
    }
}
module.exports = ReligionFiller;