const Religions = require('../../models/fandom/religions')

class ReligionStore {
    constructor() {}


    // get list of pages, input: ['name1', 'name2']
    async getMultiple(data) {
        let data = await Religions.find({
            name: {$in: data}
        }, (err, rel) => {
            if (err) return new Error(err);
            if (!rel) return { message: 'No religions matched your criteria' };
            return rel;
        });
        if (!data) {
            return { success: 0, message: 'No religion matched your criteria' };
        } else {
            return { success: 1, religions: data };
        }
    }
    
    async getAll() {
        let data = await Religions.find({}, (err, rels) => {
            if (err) return new Error(err);
        });
        if (!data) {
            return { success: -1, message: 'Religion collection empty. Has scraping been started yet?' };
        } else {
            return { success: 1, religions: data };
        }
    }

    async getByName(name) {
        let data = await Religions.findOne({name: name}, (err, rel) => {
            if (err) return new Error(err);
        });
        if (!data) {
            return { success: 0, message: 'No religion matched your criteria' };
        } else {
            return { success: 1, religions: data };
        }
    }

}
module.exports = ReligionStore;