var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var CityFandomSchema = new Schema({
    name      : {type: String, required: true, unique: true},
    location : {type: String, ref: "Continent"},
    type: {type: String},
    rulers: [{type: String}],
    religion: [{type: String, ref: "ReligionsFandom"}],
    founder: [{type: String, ref: "CharacterFandom"}],
    placesOfNote: [{type: String}]
    										//Used for highlighting regions with polygons
});

module.exports = mongoose.model('CityFandom', CityFandomSchema);
