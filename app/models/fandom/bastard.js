var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var BastardFandomSchema = new Schema({
    name      : {type: String, required: true, ref: 'CharacterFandom'}
});

module.exports = mongoose.model('BastardFandom', BastardFandomSchema);
