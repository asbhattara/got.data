const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const HouseSchema = new Schema({
    name           : {type: String, required: true, unique: true},
    image          : String,
    titles         : [String],

    coatOfArms     : String,                                                   // Sable, a dragon thrice-headed gules
    words          : String,                                                        // Fire and Blood
    currentLord    : {type: String, ref: "Character"},         // Queen Daenerys Targaryen
    overlords      : [{type: String, ref: "House"}],            // None

    seat           : String,
    region         : String,
    ancestralWeapon: [String],                                            // Blackfyre and Dark Sister

    founded        : String,                    // > 126 BC, Age of Heroes
    founder        : String,
    cadetBranch    : String,                                                  // House Blackfyre is the cadet branch of House Targaryen
    heir           : String,

    isExtinct      : Boolean,

    createdAt      : {type: Date, default: Date.now},
    updatedAt      : {type: Date, default: Date.now}
});

module.exports = mongoose.model('House', HouseSchema);
