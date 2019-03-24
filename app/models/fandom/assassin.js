var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var AssassinFandomSchema = new Schema({
    name      : {type: String, required: true, ref: 'CharacterFandom'}
});

module.exports = mongoose.model('AssassinFandom', AssassinFandomSchema);
