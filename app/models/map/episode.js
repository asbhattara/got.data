const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const EpisodeSchema = new Schema({
    totalNr      : Number, // episode nr. overall
    nr           : Number, // episode nr in season
    season       : Number,
    name         : {type: String, required: true, unique: true},
    characters   : [{type: String, ref: 'CharacterMap'}],
    airDate      : Date,
    episodeLength: {type: Number, min: 60, max: 70},

    predecessor: {type: String, ref: 'EpisodeMap'},
    successor  : {type: String, ref: 'EpisodeMap'},
    director   : String,

    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now}
});

module.exports = mongoose.model('EpisodeMap', EpisodeSchema);