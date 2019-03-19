const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const BattleFandomSchema = new Schema({
    name: {type: String, required: true, unique: true},
    slug: {type: String},
    conflict           : {type: String},
    dateOfBattle: {type: Number},
    place: [{type: String, ref: 'Region'}],
    factionsOne: [{type: String, ref: 'House'}],
    factionsTwo: [{type: String, ref: 'House'}],
    commandersOne: [{type: String, ref: 'Character'}],
    commandersTwo: [{type: String, ref: 'Character'}],
    forcesOne: [{type: String}],
    forcesTwo: [{type: String}],
    casualties: [{type: String, ref: 'Character'}],
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now}
});

module.exports = mongoose.model('BattleFandom', BattleFandomSchema);
