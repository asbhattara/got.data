const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const BattleFandomSchema = new Schema({
    name            : {type: String, required: true, unique: true},
    slug            : {type: String},
    conflict        : {type: String},
    dateOfBattle    : {type: Number},
    location        : [{type: String, ref: 'Region'}],
    factionsOne     : [{type: String, ref: 'House'}],
    factionsTwo     : [{type: String, ref: 'House'}],
    commandersOne   : [{type: String, ref: 'CharacterFandom'}],
    commandersTwo   : [{type: String, ref: 'CharacterFandom'}],
    forcesOne       : [{type: String}],
    forcesTwo       : [{type: String}],
    casualties      : [{type: String, ref: 'CharacterFandom'}],
    createdAt       : {type: Date, default: Date.now},
    updatedAt       : {type: Date, default: Date.now}
});

module.exports = mongoose.model('BattleFandom', BattleFandomSchema);
