const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const BastardFandomSchema = new Schema({
    name      : {type: String, required: true, ref: 'CharacterFandom'}
});

module.exports = mongoose.model('BastardFandom', BastardFandomSchema);
