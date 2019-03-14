const mongoose = require('mongoose'),
      Characters = require('../../../models/fandom/characters'),
      CharacterScraper = require('../../../controllers/scraper/fandom/characters'),
      PageRankScraper = require('../../../controllers/scraper/fandom/pagerank');


class CharacterFiller {
    constructor() {
        this.scraper = new CharacterScraper();
        // this.pageRankScraper = new PageRankScraper();
    }

    async fill() {
        try {
            // start scraping characters
            let data = await this.scraper.scrapeAll();
            // match scraped data to model
            data = await this.matchToModel(data);
            // add to DB
            await this.insertAll(data);
        } catch (error) {
            throw new Error(error);
        }
    }

    // remove collection
    async clearAll() {
        console.log('clearing collection...')
        return Characters.deleteMany({}, (err, data) => {
            if (err) {
                console.warn('error in removing collection: ' + err);
            } else {
                console.log('Collection successfully removed');
            }
        });
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

    async insertAll(data) {
        // clear collection
        await this.clearAll();
        try {
            return Characters.insertMany(data, (err, docs) => {
                if (err) {
                    console.warn('error in saving to db: ' + err);
                    return;
                } 
                console.log(docs.length + ' characters successfully saved to MongoDB!');
            });
        } catch (error) {
            throw new Error(error);
        }
    }
}
module.exports = CharacterFiller;