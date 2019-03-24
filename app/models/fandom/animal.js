var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var AnimalFandomSchema = new Schema({
    name      : {type: String, required: true, unique: true},
    type: {type: String},
    diet: {type: String},
    status: {type: String},
    habitat: [{type: String}],
    range: [{type: String}]
    										//Used for highlighting regions with polygons
});

module.exports = mongoose.model('AnimalFandom', AnimalFandomSchema);
