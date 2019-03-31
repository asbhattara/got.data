var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var AgeFandomSchema = new Schema({
    name      : {type: String, required: true, unique: true},
    age 	: {type: Number}
    										//Used for highlighting regions with polygons
});

module.exports = mongoose.model('AgeFandom', AgeFandomSchema);
