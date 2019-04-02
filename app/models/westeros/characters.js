const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const CharacterSchema = new Schema({
    name            : {type: String, required: true, unique: true},                                // Rhaegar
    titles          : [String],                                                        // Prince of Dragonstone Ser
    male            : Boolean,                                                       // Male
    culture         : String,             // Valyrian
    age             : {type: Number, min: 1, max: 200},                              // ??
    dateOfBirth     : Number,                                                        // 259 AC
    dateOfDeath     : Number,  	                                                     // 283 AC
    actor           : String,
    mother          : {type: String, ref: 'Character'},
    father          : {type: String, ref: 'Character'},
    heir            : {type: String, ref: 'Character'},
    placeOfBirth    : {type: String, ref: "Region"},                                                 // Summerhall
    placeOfDeath    : {type: String, ref: "Region"},                                                 // Trident
    house           : {type: String, ref: "House"},
    plod            : {type: Number, default: 0.0},
    longevity       : [Number],
    createdAt       : {type: Date, default: Date.now},
    updatedAt       : {type: Date, default: Date.now},
    spouse          : [{type: String, ref: 'Character'}],
    children        : [{type: String, ref: 'Character'}],
    allegiance      : [{type: String, ref: 'Character'}],
    books           : [String],
    placeOfLastVisit: {type: String, ref: "Region"}, 
    imageLink		: String,
    slug		    : String,
    hasPath		    : Boolean
}, { 
    toJSON: { virtuals: true }, 
    toObject: { virtuals: true } 
});

CharacterSchema.virtual('pagerank', {
    ref: 'PageRankFandom',
    localField: 'slug',
    foreignField: 'title',
    justOne: true
});

module.exports = mongoose.model('Character', CharacterSchema);
