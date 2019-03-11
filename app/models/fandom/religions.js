const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const RegionSchema = new Schema({
    name        : {type: String, required: true, unique: true},
    slug        : String,
    image       : String,

    type        : [String],
    clergy      : {type: String, ref: "Character"},
    locations   : [{type: Schema.Types.ObjectId, ref: "Region"}],
    leaders     : [{type: String, ref: "Character"}],
    center      : String,

    neighbors   : [{type: Schema.Types.ObjectId, ref: "Region"}],
    cultures    : [{type: Schema.Types.ObjectId, ref: "Culture"}],
    events      : [{type: Schema.Types.ObjectId, ref: "Event"}],
    // color       : String,
    // borders     : [[String]],
    // highlights  : [String]										
});

module.exports = mongoose.model('Region', RegionSchema);

