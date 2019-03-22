const Episodes = require('../../models/fandom/episodes')

class EpisodeStore {
    constructor() {}


    // get list of episodes, input: ['name1', 'name2']
    async getMultiple(data) {
        let data = await Episodes.find({
            title: {$in: data}
        }, (err, eps) => {
            if (err) return new Error(err);
        });
        if (!data) {
            return { success: 0, message: 'No episodes matched your criteria' };
        } else {
            return { success: 1, episodes: data };
        }
    }
    
    async getAll() {
        let data = await Episodes.find({}, (err, eps) => {
            if (err) return new Error(err);
        });
        if (!data) {
            return { success: -1, message: 'Episode collection empty. Scraping should be started...' };
        } else {
            return { success: 1, episodes: data };
        }
    }

    async getByTitle(title) {
        let data = await Episodes.findOne({title: title}, (err, ep) => {
            if (err) return new Error(err);
        });
        if (!data) {
            return { success: 0, message: 'No episodes matched your criteria' };
        } else {
            return { success: 1, episodes: data };
        }
    }

}
module.exports = EpisodeStore;