var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var RegionFandomSchema = new Schema({
    name            : {type: String, required: true, unique: true},
    location        : {type: String, ref: "Continent"},
    geography       : {type: String},
    rulers          : [{type: String, ref: "CharacterFandom"}],
    religion        : [{type: String, ref: "ReligionsFandom"}],
    culture         : [{type: String, ref: "Culture"}],
    regionCapital   : {type: String},
    cities          : [{type: String}],
    towns           : [{type: String}],
    castles         : [{type: String, ref: "CastleFandom"}],
    founder         : [{type: String, ref: "CharacterFandom"}],
    placesOfNote    : [{type: String}]
});

module.exports = mongoose.model('RegionFandom', RegionFandomSchema);
