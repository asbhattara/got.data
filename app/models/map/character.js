const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const CharacterSchema = new Schema({
    name       : {type: String, required: true, unique: true},
    titles      : [String],
    male       : Boolean,
    culture    : String,
    age        : {type: Number, min: 1, max: 200},
    dateOfBirth: Number,
    dateOfDeath: Number,
    actor      : String,
    mother: {type: String, ref: 'CharacterMap'},
    father: {type: String, ref: 'CharacterMap'},
    heir  : {type: String, ref: 'CharacterMap'},
    placeOfBirth: {type: String, ref: "RegionMap"},
    placeOfDeath: {type: String, ref: "RegionMap"},
    house       : {type: String, ref: "HouseWesteros"},
    createdAt   : {type: Date, default: Date.now},
    updatedAt   : {type: Date, default: Date.now},
    spouse             : {type: String, ref: 'CharacterMap'},
    allegiance         : {type: String, ref: 'CharacterMap'},
    pageRank: Number,
    books              : [String],
    placeOfLastVisit   : {type: String, ref: "RegionMap"},
    imageLink		: String,
    slug		: String,
    hasPath		: Boolean
});

module.exports = mongoose.model('CharacterMap', CharacterSchema);