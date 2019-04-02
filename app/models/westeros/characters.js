const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const CharacterSchema = new Schema({
    name            : {type: String, required: true},
    slug		    : {type: String, required: true, unique: true},
    titles          : [String],
    gender          : String,
    image		    : String,
    alive           : Boolean,
    birth           : Number,
    death           : Number,
    placeOfBirth    : {type: String, ref: "Region"},
    placeOfDeath    : {type: String, ref: "Region"},
    age             : {type: Number, min: 1, max: 200},

    mother          : {type: String, ref: 'CharacterWesteros'},
    father          : {type: String, ref: 'CharacterWesteros'},
    spouse          : [{type: String, ref: 'CharacterWesteros'}],
    children        : [{type: String, ref: 'CharacterWesteros'}],
    heir            : {type: String, ref: 'CharacterWesteros'},

    culture         : String,

    house           : {type: String, ref: "House"},
    longevity       : [{type: Number, default: 0.0}],
    allegiance      : [{type: String, ref: 'Character'}],

    books           : [String],
    placeOfLastVisit: {type: String, ref: "Region"},
    hasPath		    : Boolean,

    plod            : {type: Number, default: 0.0},

    createdAt       : {type: Date, default: Date.now},
    updatedAt       : {type: Date, default: Date.now}
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

module.exports = mongoose.model('CharacterWesteros', CharacterSchema);
