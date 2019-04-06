const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const HouseFandomSchema = new Schema({
    name           : {type: String, required: true, unique: true},
    sigil          : {type: String},                                                   // Sable, a dragon thrice-headed gules
    words          : {type: String},
    seat           : [{type: String}],
    allegiance     : [{type: String, ref: 'HouseFandom'}],
    region         : [{type: String, ref: 'RegionFandom'}],
    religion       : [{type: String, ref: 'ReligionFandom'}],
    logoURL        : {type: String},
    createdAt      : {type: Date, default: Date.now},
    updatedAt      : {type: Date, default: Date.now}
});

module.exports = mongoose.model('HouseFandom', HouseFandomSchema);
