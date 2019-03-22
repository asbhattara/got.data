const PageRanks = require('../../models/fandom/pagerank')

class PageRankStore {
    constructor() {}


    // get list of pages, input: ['title1', 'title2']
    async getMultiple(data) {
        let data = await Episodes.find({
            title: {$in: data}
        }, (err, ranks) => {
            if (err) return new Error(err);
        });
        if (!data) {
            return { success: 0, message: 'No page matched your criteria' };
        } else {
            return { success: 1, ranks: data };
        }
    }
    
    async getAll() {
        let data = await PageRanks.find({}, (err, ranks) => {
            if (err) return new Error(err);
        });
        if (!data) {
            return { success: -1, message: 'PageRank collection empty. Scraping should be started...' };
        } else {
            return { success: 1, ranks: data };
        }
    }

    async getByTitle(title) {
        let data = await PageRanks.findOne({title: title}, (err, rank) => {
            if (err) return new Error(err);
        });
        if (!data) {
            return { success: 0, message: 'No page matched your criteria' };
        } else {
            return { success: 1, ranks: data };
        }
    }

}
module.exports = PageRankStore;