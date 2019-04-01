const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const CityFandomSchema = new Schema({
    name            : {type: String, required: true, unique: true},
    location        : {type: String, ref: "Continent"},
    type            : {type: String},
    rulers          : [{type: String}],
    religion        : [{type: String, ref: "ReligionsFandom"}],
    founder         : [{type: String, ref: "CharacterFandom"}],
    placesOfNote    : [{type: String}]
});

module.exports = mongoose.model('CityFandom', CityFandomSchema);
