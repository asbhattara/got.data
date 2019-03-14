const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const PageRankSchema = new Schema({
    title       : {type: String, required: true, unique: true},
    rank        : Number
});

module.exports = mongoose.model('PageRank', PageRankSchema);