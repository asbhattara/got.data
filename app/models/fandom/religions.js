const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const ReligionFandomSchema = new Schema({
    name        : {type: String, required: true, unique: true},
    slug        : String,
    image       : String,

    type        : [String],
    clergy      : {type: String, ref: "CharacterFandom"},
    locations   : [{type: String, ref: "RegionFandom"}],
    leaders     : [{type: String, ref: "CharacterFandom"}],
    center      : String,

    neighbors   : [{type: String, ref: "RegionFandom"}],
    cultures    : [{type: String, ref: "Culture"}],
    events      : [{type: String, ref: "Event"}],
    // color       : String,
    // borders     : [[String]],
    // highlights  : [String]										
});

module.exports = mongoose.model('ReligionsFandom', ReligionFandomSchema);

