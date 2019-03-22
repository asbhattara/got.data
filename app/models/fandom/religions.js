const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const ReligionSchema = new Schema({
    name        : {type: String, required: true, unique: true},
    slug        : String,
    image       : String,

    type        : [String],
    clergy      : {type: String, ref: "Character"},
    locations   : [{type: String, ref: "Region"}],
    leaders     : [{type: String, ref: "Character"}],
    center      : String,

    neighbors   : [{type: String, ref: "Region"}],
    cultures    : [{type: String, ref: "Culture"}],
    events      : [{type: String, ref: "Event"}],
    // color       : String,
    // borders     : [[String]],
    // highlights  : [String]										
});

module.exports = mongoose.model('Religion', ReligionSchema, 'show');

