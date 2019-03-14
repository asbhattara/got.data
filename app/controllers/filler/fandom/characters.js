const mongoose = require('mongoose'),
      Characters = require('../../../models/fandom/characters'),
      CharacterScraper = require('../../../controllers/scraper/fandom/characters');


class CharacterFiller {
    constructor() {
        this.scraper = new CharacterScraper();
    }

    async fill() {
        try {
            // start scraping
            let data = await this.scraper.scrapeAll();
            // clear collection (should only run for fresh scrape)
            // await this.clearAll();
            // match scraped data to model
            data = await this.matchToModel(data);
            // add to DB
            await this.insertToDb(data);
        } catch (error) {
            throw new Error(error);
        }
    }

    // remove collection
    async clearAll() {
        console.log('clearing collection...')
        Characters.deleteMany({}, (err, data) => {
            if (err) {
                console.warn('error in removing collection: ' + err);
            } else {
                console.log('Collection successfully removed');
            }
        });
        return;
    }
    // match attributes from Scraper to Mongoose Schema
    async matchToModel(characters) {
        console.log('formating and saving scraped data to DB... this may take a few seconds');
        characters.map(character => {
            let newChar = new Characters();
            for(let attr in character) {
                // numbers sometimes return NaN which throws error in DB
                if((attr == 'birth' || attr == 'death' || attr == 'seasons') && isNaN(character[attr])) {
                    delete character[attr];
                } 
                newChar[attr] = character[attr];
            }
            return newChar;
        });
        return characters.filter(character => character['name'] && character['slug']);
    }

    async insertToDb(data) {
        Characters.countDocuments(async (err, count) => {
            if (err) {
                return new Error(err);
            } else {
                await this.insertAll(data);
            }
            // update feature necessary?
            // if (count === 0) {
            //     await this.insertAll(data);
            // } else {
            //     await this.updateAll(data);
            // }
        });
        return;
    }

    async insertAll(data) {
        // clear collection
        await this.clearAll();
        return await Characters.insertMany(data, (err, docs) => {
            if (err) {
                console.warn('error in saving to db: ' + err);
                return;
            } 
            console.log(docs.length + ' characters successfully saved to MongoDB!');
        });
    }

    // async updateAll(data) {
    //     return await Characters.bulkWrite(
    //         data.map((newChar) => {
    //             Characters.findOne({name: newChar.name}, (err, oldChar) => {
    //                 if (err) return new Error(err);
    //                 // save if character doesn't exist or old values
    //                 if (!res || (newChar.updatedAt > oldChar.updatedAt)) 
    //                     return Characters.save(newChar, (err) => new Error(err));
    //             })
    //         })
    //     );
    // }
}
module.exports = CharacterFiller;