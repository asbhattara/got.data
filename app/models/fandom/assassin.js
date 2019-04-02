const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const AssassinFandomSchema = new Schema({
    name      : {type: String, required: true, ref: 'CharacterFandom'}
});

module.exports = mongoose.model('AssassinFandom', AssassinFandomSchema);
