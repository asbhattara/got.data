const PageRanks = require('../../models/fandom/pagerank')

class PageRankStore {
    constructor() {}


    // get list of pages, input: ['title1', 'title2']
    async getMultiple(data) {
        return await Episodes.find({
            title: {$in: data}
        }, (err, ranks) => {
            if (err) return new Error(err);
            if (!ranks) return { message: 'no pages matched your criteria' };
            return ranks;
        })
    }
    
    async getAll() {
        return await PageRanks.find({}, (err, ranks) => {
            if (err) return new Error(err);
            if (!ranks) return { message: 'PageRank collection empty. Scraping should be started...' };
            return ranks;
        })
    }

    async getByTitle(title) {
        return await PageRanks.findOne({title: title}, (err, rank) => {
            if (err) return new Error(err);
            if (!rank) return { message: 'no page matched your criteria' };
            return rank;
        })
    }

}
module.exports = PageRankStore;