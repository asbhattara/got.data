const mongoose = require('mongoose'),
    Characters = require('../../../models/westeros/characters'),
    CharacterScraper = require('../../../controllers/scraper/westeros/characters');


class CharacterFiller {
    constructor(policy) {
        this.POLICY_REFILL = 1;
        this.POLICY_UPDATE = 2;
        this.POLICY_SAFE_UPDATE = 3;

        this.scraper = new CharacterScraper();
        this.policy = policy;
    }

    async fill() {
        try {
            // start scraping characters
            let data = await this.scraper.getAll();
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
        console.log('clearing collection...');
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
                // remove spaces and html tags
                if (typeof character[attr] == 'string') {
                    character[attr] = character[attr].trim().replace(/\*?<(?:.|\n)*?>/gm, '');
                }
                if((attr == 'dateOfBirth' || attr == 'dateOfDeath') && isNaN(character[attr])) {
                    delete character[attr];
                    continue;
                } 

                newChar[attr] = character[attr];
            }

            return newChar;
        });

        return characters;
    }

    async insertAll(data) {
        // clear collection
        if(this.policy === this.POLICY_REFILL)
        {
            await this.clearAll();
        }
        else
        {
            // TODO: update ?
        }

        try {
            return Characters.insertMany(data, (err, docs) => {
                if (err) {
                    console.warn('error in saving to db: ' + err);
                    return;
                }
                console.log(docs.length + ' character locations successfully saved to MongoDB!');
            });
        } catch (error) {
            throw new Error(error);
        }
    }
}

module.exports = CharacterFiller;