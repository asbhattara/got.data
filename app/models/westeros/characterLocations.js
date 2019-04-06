const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const CharacterLocationSchema = new Schema({
    name : {type: String, ref: 'CharacterWesteros', required: true, unique: true},
    slug: {type: String, unique: true, required: true},
    locations: [String]
});

module.exports = mongoose.model('CharacterLocationWesteros', CharacterLocationSchema);
