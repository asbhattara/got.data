const mongoose = require('mongoose'),
    Ages = require('../../../models/westeros/ages'),
    AgesScraper = require('../../../controllers/scraper/westeros/ages');


class AgesFiller {
    constructor(policy) {
        this.POLICY_REFILL = 1;
        this.POLICY_UPDATE = 2;
        this.POLICY_SAFE_UPDATE = 3;

        this.scraper = new AgesScraper();
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
        return Ages.deleteMany({}, (err, data) => {
            if (err) {
                console.warn('error in removing collection: ' + err);
            } else {
                console.log('Collection successfully removed');
            }
        });
    }

    // match attributes from Scraper to Mongoose Schema
    async matchToModel(ages) {
        console.log('formating and saving scraped data to DB... this may take a few seconds');
        ages.map(age => {
            let newChar = new Ages();

            for(let attr in age) {
                // translate startDate to (negative) number
                if(attr === 'startDate') {
                    if(age[attr].indexOf('BC')>-1) {
                        age[attr] = 0 - age[attr].replace(/[^0-9\.]/g, '');
                    }
                    else if(age[attr].indexOf('AC')>-1) {
                        age[attr] = age[attr].replace(/[^0-9\.]/g, '');
                    }
                    else if(age[attr].indexOf('ca')>-1) {
                        age[attr] = age[attr].replace('ca.','').replace(',','');
                    }
                    else {
                        delete age[attr];
                    }
                }

                // translate startDate to (negative) number
                if(attr === 'endDate') {
                    if(age[attr].indexOf('BC')>-1) {
                        age[attr] = 0 - age[attr].replace(/[^0-9\.]/g, '');
                    }
                    else if(age[attr].indexOf('282-283 AC')>-1) { //hardcoded =/
                        age[attr] = 283;
                    }
                    else if(age[attr].indexOf('AC')>-1) {
                        age[attr] = age[attr].replace(/[^0-9\.]/g, '');
                    }
                    else if(age[attr].indexOf('~')>-1) {
                        age[attr] = age[attr].replace('~', '');
                    }
                    else if(age[attr].indexOf('ca')>-1) {
                        age[attr] = age[attr].replace('ca.','').replace(',','').replace(' ','');
                    }
                    else {
                        delete age[attr];
                    }
                }

                // remove spaces and html tags
                if (typeof age[attr] == 'string') {
                    age[attr] = age[attr].trim().replace(/\*?<(?:.|\n)*?>/gm, '');
                }

                newChar[attr] = age[attr];
            }

            return newChar;
        });

        return ages;
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
            return Ages.insertMany(data, (err, docs) => {
                if (err) {
                    console.warn('error in saving to db: ' + err);
                    return;
                }
                console.log(docs.length + ' ages successfully saved to MongoDB!');
            });
        } catch (error) {
            throw new Error(error);
        }
    }
}

module.exports = AgesFiller;