const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const ContinentSchema = new Schema({
    name             : {type: String, required: true, unique: true},
    neighbors        : [{type: String, ref: "Continent"}],
    cardinalDirection: String // west, east, north, south
});

module.exports = mongoose.model('Continent', ContinentSchema);
