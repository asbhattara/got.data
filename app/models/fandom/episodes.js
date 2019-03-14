const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const EpisodeSchema = new Schema({
    title           : {type: String, required: true, unique: true},
    number          : Number,
    season          : Number,
    episode         : Number,
    image           : String,
    date            : Date,
    viewers         : Number,

    runtime         : Number,
    written_by      : String,
    directed_by     : String,
    preview_text    : String,

    characters      : [{type: String, ref: 'Character'}],
    deaths          : [{type: String, ref: 'Character'}],
    places          : [{type: String, ref: 'City'}],
    
    predecessor     : {type: String, ref: 'Episode'},
    successor       : {type: String, ref: 'Episode'},
    
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Episode', EpisodeSchema);
