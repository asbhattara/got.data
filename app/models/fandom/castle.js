const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const CastleFandomSchema = new Schema({
    name        : {type: String, required: true, unique: true},
    location    : {type: String, ref: "RegionFandom"},
    type        : {type: String},
    religion    : [{type: String, ref: "ReligionsFandom"}],
    rulers      : [{type: String, ref: "House"}],
    age         : {type: Number},
    founder     : [{type: String}]
});

module.exports = mongoose.model('CastleFandom', CastleFandomSchema);