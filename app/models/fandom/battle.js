const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const BattleFandomSchema = new Schema({
    name: {type: String, required: true, unique: true},
    slug: {type: String},
    conflict           : {type: String},
    dateOfBattle: {type: Number},
    place: [{type: String, ref: 'RegionFandom'}],
    factionsOne: [{type: String, ref: 'HouseFandom'}],
    factionsTwo: [{type: String, ref: 'HouseFandom'}],
    commandersOne: [{type: String, ref: 'CharacterFandom'}],
    commandersTwo: [{type: String, ref: 'CharacterFandom'}],
    forcesOne: [{type: String}],
    forcesTwo: [{type: String}],
    casualties: [{type: String, ref: 'CharacterFandom'}],
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now}
});

module.exports = mongoose.model('BattleFandom', BattleFandomSchema);
