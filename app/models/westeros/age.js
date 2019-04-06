const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const AgeSchema = new Schema({
    name       : {type: String, required: true, unique: true},
    startDate  : {type: Number},
    endDate    : {type: Number},
    predecessor: {type: String, ref: 'AgeWesteros'},
    successor  : {type: String, ref: 'AgeWesteros'}
});

module.exports = mongoose.model('AgeWesteros', AgeSchema);
