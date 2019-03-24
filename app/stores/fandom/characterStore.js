const CharactersFandom = require('../../models/fandom/characters');

class CharacterStore {
    constructor() {}

    async add(character) {
        try {
            for (let key in character) {
                if (!CharactersFandom.schema.path.hasOwnProperty(key)) {
                    return { message: 'Character attribute ' + key + ' doesn\'t match MongoDB schema!' }
                }
            }
            return await CharactersFandom.find({name: character.name}, (err, char) => {
                if (err) throw new Error(err);
                if (char) return { message: 'Character ' + character.name + ' already exists!'}
            })
        } catch (e) {
            return { success: 0, message: 'error in database query! - ' + e }
        }
    }

    // get list of characters, input: ['name1', 'name2']
    async getMultiple(data) {
        try {
            let data = await CharactersFandom.find({
                name: {$in: data}
            }, (err, chars) => {
                if (err) throw new Error(err);
            });
            if (!data) {
                return { success: 0, message: 'No characters matched your criteria' };
            } else {
                return { success: 1, data: data };
            }
        } catch (e) {
            return { success: 0, message: 'error in database query! - ' + e }
        }
        
    }
    
    async getAll() {
        try {
            let data = await CharactersFandom.find({}, (err, chars) => {
                if (err) throw new Error(err);
            });
            // .populate({ path: 'pagerank', select: 'title rank'})
            // .exec(function(err, data) {
            //     if(err) throw new Error(err);
            //     return data;
            // });
            // console.log(data);
            if (!data) {
                return { success: -1, message: 'Character collection empty. Scraping should be started...' };
            } else {
                return { success: 1, data: data };
            }
            
        } catch (e) {
            return { success: 0, message: 'error in database query! - ' + e }
        }
    }

    async getByName(name) {
        try {
            let data = await CharactersFandom.findOne({name: name}, (err, char) => {
                if (err) throw new Error(err);
            });
            if (!data) {
                return { success: 0, message: 'No characters matched your criteria' };
            } else {
                return { success: 1, data: data };
            }
        } catch (e) {
            return { success: 0, message: 'error in database query! - ' + e }
        }
    }

    async getBySlug(slug) {
        try {
            let data = await CharactersFandom.findOne({slug: slug}, (err, char) => {
                if (err) throw new Error(err);
            });
            if (!data) {
                return { success: 0, message: 'No characters matched your criteria' };
            } else {
                return { success: 1, data: data };
            }
        } catch (e) {
            return { success: 0, message: 'error in database query! - ' + e }
        }
    }

    async getByHouse(house) {
        try {
            let data = await CharactersFandom.find({house: house}, (err, chars) => {
                if (err) throw new Error(err);
            });
            if (!data) {
                return { success: 0, message: 'No characters matched your criteria' };
            } else {
                return { success: 1, data: data };
            }
        } catch (e) {
            return { success: 0, message: 'error in database query! - ' + e }
        }
    }

}
module.exports = CharacterStore;
