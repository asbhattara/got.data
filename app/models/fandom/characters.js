const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const CharacterFandomSchema = new Schema({
    name            : {type: String, required: true, unique: true},
    slug            : {type: String, required: true},                           
    titles          : [{type: String}],                                                        
    gender          : String,
    image           : String,                                                       
    alive           : Boolean,
    birth           : Number,
    death           : Number,
    origin          : [{type: String}],
    mother          : {type: String, ref: 'CharacterFandom'},
    father          : {type: String, ref: 'CharacterFandom'},
    siblings        : [{type: String, ref: 'CharacterFandom'}],
    house           : {type: String, ref: 'HouseFandom'},
    spouse          : [{type: String, ref: 'CharacterFandom'}],
    lovers          : [{type: String, ref: 'CharacterFandom'}],
    plod            : {type: Number, default: 0.0},
    longevityStart  : Number,
    longevity       : [{type: Number}],
    plodB           : {type: Number, default: 0.0},
    plodC           : {type: Number, default: 0.0},
    longevityB      : [{type: Number}],
    longevityC      : [{type: Number}],
    longevityStartB  : Number,
    longevityStartC  : Number,

    culture        : [{type: String, ref: 'CultureFandom'}],
    religion       : [{type: String, ref: 'ReligionFandom'}],
    allegiances     : [{type: String, ref: 'CharacterFandom'}],

    first_seen      : {type: String, ref: 'Episode'},
    seasons         : [Number],
    appearances     : [{type: String, ref: 'Episode'}],
    rank : Number,
    actor           : String,
    createdAt       : {type: Date, default: Date.now},
    updatedAt       : {type: Date, default: Date.now},
}, { 
    toJSON: { virtuals: true }, 
    toObject: { virtuals: true } 
});

CharacterFandomSchema.virtual('pagerank', {
    ref: 'PageRankFandom',
    localField: 'slug',
    foreignField: 'title',
    justOne: true
});

CharacterFandomSchema.virtual('age', {
    ref: 'AgeFandom',
    localField: 'name',
    foreignField: 'name',
    justOne: true
});

let autoPopulate = function(next) {
    this.populate({ path: 'pagerank', select: {rank: 1, title: 0, _id: 0}});
    this.populate({ path: 'age', select: {age: 1, name: 0, _id: 0}});
    next();
}

CharacterFandomSchema.
    pre('find', autoPopulate).
    pre('findOne', autoPopulate);

module.exports = mongoose.model('CharacterFandom', CharacterFandomSchema);
