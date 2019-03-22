const Religions = require('../../models/fandom/religions')

class ReligionStore {
    constructor() {}


    // get list of pages, input: ['name1', 'name2']
    async getMultiple(data) {
        return await Religions.find({
            name: {$in: data}
        }, (err, rel) => {
            if (err) return new Error(err);
            if (!rel) return { message: 'No religions matched your criteria' };
            return rel;
        })
    }
    
    async getAll() {
        return await Religions.find({}, (err, rels) => {
            if (err) return new Error(err);
            if (!rels) return { message: 'Religion collection empty. Has scraping been started yet?' };
            return rels;
        })
    }

    async getByName(name) {
        return await Religions.findOne({name: name}, (err, rel) => {
            if (err) return new Error(err);
            if (!rel) return { message: 'No religion matched your criteria' };
            return rel;
        })
    }

}
module.exports = ReligionStore;