const Episodes = require('../../models/fandom/episodes')

class EpisodeStore {
    constructor() {}


    // get list of episodes, input: ['name1', 'name2']
    async getMultiple(data) {
        return await Episodes.find({
            title: {$in: data}
        }, (err, eps) => {
            if (err) return new Error(err);
            if (!eps) return { message: 'no episode matched your criteria' };
            return eps;
        })
    }
    
    async getAll() {
        return await Episodes.find({}, (err, eps) => {
            if (err) return new Error(err);
            if (!eps) return { message: 'Episode collection empty. Scraping should be started...' };
            return eps;
        })
    }

    async getByTitle(title) {
        return await Episodes.findOne({title: title}, (err, ep) => {
            if (err) return new Error(err);
            if (!ep) return { message: 'no episodes matched your criteria' };
            return ep;
        })
    }

}
module.exports = EpisodeStore;