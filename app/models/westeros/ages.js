const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const AgeSchema = new Schema({
    name       : {type: String, required: true, unique: true},
    startDate  : {type: Number},
    endDate    : {type: Number},
    predecessor: {type: String, ref: 'Age'},
    successor  : {type: String, ref: 'Age'}
});

module.exports = mongoose.model('Age', AgeSchema);
