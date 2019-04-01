const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const RegionSchema = new Schema({
    name      : {type: String, required: true, unique: true},
    continent : {type: Schema.Types.ObjectId, ref: "Continent"},
    neighbors : [{type: Schema.Types.ObjectId, ref: "Region"}],
    cultures  : [{type: Schema.Types.ObjectId, ref: "Culture"}],
    events    : [{type: Schema.Types.ObjectId, ref: "Event"}],
    color    : String,
    borders    : [[String]],
    highlights: [String]										//Used for highlighting regions with polygons
});

module.exports = mongoose.model('Region', RegionSchema);
