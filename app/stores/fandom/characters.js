const Characters = require('../../models/fandom/characters');



class CharacterStore {
    constructor() {}

    async add(character) {
        for (let key in character) {
            if (!Characters.schema.path.hasOwnProperty(key)) {
                return { message: 'Character attribute ' + key + ' doesn\'t match MongoDB schema!' }
            }
        }
        return await Characters.find({name: character.name}, (err, char) => {
            if (err) return new Error(err);
            if (char) return { message: 'Character ' + character.name + ' already exists!'}
        })
    }

    // get list of characters, input: ['name1', 'name2']
    async getMultiple(data) {
        return await Characters.find({
            name: {$in: data}
        }, (err, chars) => {
            if (err) return new Error(err);
            if (!chars) return { message: 'no characters matched your criteria' };
            return chars;
        })
    }
    
    async getAll() {
        return await Characters.find({}, (err, chars) => {
            if (err) return new Error(err);
            if (!chars) return { message: 'Character database empty. Scraping should be started...' };
            return chars;
        });
    }

    async getByName(name) {
        return await Characters.findOne({name: name}, (err, char) => {
            if (err) return new Error(err);
            if (!char) return { message: 'no characters matched your criteria' };
            return char;
        })
    }

    async getByHouse(house) {
        return await Characters.find({house: house}, (err, chars) => {
            if (err) return new Error(err);
            if (!chars) return { message: 'no characters matched your criteria' };
            return chars;
        });
    }

}
module.exports = CharacterStore;
