var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var RegionFandomSchema = new Schema({
    name      : {type: String, required: true, unique: true},
    continent : {type: Schema.Types.ObjectId, ref: "Continent"},
    geography: {type: String},
    religion: [{type: String, ref: "ReligionsFandom"}],
    culture: [{type: String, ref: "Culture"}],
    regionCapital: [{type: String}],
    cities: [{type: String}],
    towns: [{type: String}],
    castles: [{type: String}],
    founder: {type: String},
    placesOfNote: [{type: String}]
    										//Used for highlighting regions with polygons
});

module.exports = mongoose.model('RegionFandom', RegionFandomSchema);
