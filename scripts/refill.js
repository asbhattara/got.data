require(__dirname + '/../' + 'constants');

/*
 * check console input
 */
let collection = process.env.npm_config_collection;
let wiki = process.env.npm_config_wiki;

if(collection === undefined) {
    console.log('Provide which collection should be refilled. Example: npm refill --collection=characters ');
    process.exit();
}

if(wiki !== "fandom")
{
    wiki = "westeros";
}

let possibleRefillings = [
    'ages',
    'characters',
    'episodes',
    'cities',
    'continents',
    'cultures',
    'events',
    'houses',
    'regions',
    'characterLocations',
    'characterPaths',
    'characterImages',
    'characterPlods',
    'episodesFandom',
    'charactersFandom',
    'religionsFandom',
    'battleFandom',
    'bastardFandom',
    'assassinFandom',
    'castleFandom',
    'regionFandom',
    'animalFandom',
    'townFandom',
    'cityFandom',
    'ageFandom',
    'houseFandom'
]

if(possibleRefillings.indexOf(collection) < 0) {
    console.log('Request ' + collection + ' is unknown. Possible refills: ' + possibleRefillings.join(', ') + '.');
    process.exit();
}
/*
 * start
 */
console.log('Refilling collection: '+ collection);

let config = require('../cfg/config');
let mongoose = require('mongoose');

global.__base = __dirname + '/../';
global.__appbase = __dirname + '/../app/';

//Create the DB connection string
let databaseParams = config.database;
let dbConnection = "mongodb://";
if (databaseParams.username.length > 0 && databaseParams.password.length > 0) {
    dbConnection += databaseParams.username + ":" + databaseParams.password + "@";
}
dbConnection += databaseParams.uri + ":" + databaseParams.port + "/" + databaseParams.collection;

//Create the connection to mongodb
console.log("Going to connect to " + dbConnection);
mongoose.connect(dbConnection);
let db = mongoose.connection;

// CONNECTION EVENTS: When successfully connected
db.on('connected', function () {
    console.log('Mongoose connected');
});

// If the connection throws an error
db.on('error', function (err) {
    console.log('Mongoose default connection error: ' + err);
});

// When the connection is disconnected
db.on('disconnected', function () {
    console.log('Mongoose default connection disconnected');
});

db.on('open', function () {
    if(requested == 'episodesFandom' || requested == 'charactersFandom' || requested == 'religionsFandom'
        || requested == 'battleFandom' || requested == 'bastardFandom' || requested == 'assassinFandom' 
        || requested == 'castleFandom' || requested == 'regionFandom' || requested == 'animalFandom'
        || requested == 'townFandom' || requested == 'cityFandom' || requested == 'ageFandom' || requested == 'houseFandom') {
	var scraper = require('../app/controllers/filler/' + requested)
	var controller = new scraper();
	controller.fill();
    }
    else if(requested != 'characterPlods') {
        var controller = require('../app/controllers/filler/' + requested);
        controller.fill(1,function() {process.exit();});
    }
    else {
        let controller = require('../app/controllers/filler/characters');
        controller.updatePlods(1,function(){
            console.log('Finished refilling plods!');
            process.exit();
        });
    }
});
