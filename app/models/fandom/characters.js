const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const CharacterFandomSchema = new Schema({
    name            : {type: String, required: true, unique: true},
    slug            : {type: String, required: true},
    nicknames       : [String],                               
    titles          : [String],                                                        
    gender          : String,
    image           : String,                                                       
    alive           : Boolean,
    birth           : Number,
    death           : Number,
    origin          : String,
    mother          : {type: String, ref: 'CharacterFandom'},
    father          : {type: String, ref: 'CharacterFandom'},
    siblings        : [{type: String, ref: 'CharacterFandom'}],
    house           : {type: String, ref: 'House'},
    spouse          : {type: String, ref: 'CharacterFandom'},
    lovers          : [{type: String, ref: 'CharacterFandom'}],
    plod            : {type: Number, default: 0.0},
    longevity       : [{type: Number, default: 0.0}],

    cultures        : [{type: String, ref: 'Culture'}],
    religions       : [{type: String, ref: 'Religion'}],
    allegiances     : [{type: String, ref: 'CharacterFandom'}],

    first_seen      : {type: String, ref: 'Episode'},
    seasons         : [Number],
    appearances     : [{type: String, ref: 'Episode'}],

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


module.exports = mongoose.model('CharacterFandom', CharacterFandomSchema);
