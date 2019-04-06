var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var EventFandomSchema = new Schema({
    name: {type: String},
    slug: {type: String},
    conflict: {type: String},
    place: [{type: String, ref: 'RegionFandom'}],
    dateOfEvent: Number,
    participants: [{type: String, ref: 'CharacterFandom'}],
    factions: [{type: String, ref: 'HouseFandom'}],
    leaders: [{type: String, ref: 'CharacterFandom'}],
    casualties: [{type: String, ref: 'CharacterFandom'}],
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now},
});
module.exports = mongoose.model('EventFandom', EventFandomSchema);