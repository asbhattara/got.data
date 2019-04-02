const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const TownFandomSchema = new Schema({
    name        : {type: String, required: true, unique: true},
    location    : {type: String, ref: "Continent"},
    type        : {type: String},
    rulers      : [{type: String}],
    religion    : [{type: String, ref: "ReligionsFandom"}]
});

module.exports = mongoose.model('TownFandom', TownFandomSchema);
