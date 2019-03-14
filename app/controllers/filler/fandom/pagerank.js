const PageRankScraper = require('../../../controllers/scraper/fandom/pagerank');
const PageRanks = require('../../../models/fandom/pagerank');

class PageRankFiller {
    constructor() {
        this.scraper = new PageRankScraper();
    }

    async fill() {
        // scrape page ranks
        let data = await this.scraper.scrapePageRanks();

        // match to db schema
        data = await this.matchToModel(data);

        // write to db
        await this.insertAll(data);
    }

    async matchToModel(data) {
        console.log('matching data to DB model...');
        let ranks = [];
        Object.keys(data).map((key) => {
            let newRank = new PageRanks();
            newRank['title'] = key;
            newRank['rank'] = data[key];
            ranks.push(newRank);
        });
        return ranks.filter((entry) => entry['title']);
    }

    // remove collection
    async clearAll() {
        console.log('clearing collection...')
        return PageRanks.deleteMany({}, (err, data) => {
            if (err) {
                console.warn('Error in removing collection: ' + err);
            } else {
                console.log('Collection successfully removed');
            }
        });
    }

    async insertAll(data) {
        await this.clearAll();
        console.log('writing to db...');
        try {
            return PageRanks.insertMany(data, (err, docs) => {
                if (err) {
                    console.warn('error in saving to db: ' + err);
                    return;
                } 
                console.log(docs.length + ' characters successfully saved to MongoDB!');
            });
        } catch (e) {
            throw new Error(e);
        }
    }
}
module.exports = PageRankFiller;