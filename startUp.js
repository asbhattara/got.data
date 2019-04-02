'use strict';
require(__dirname + '/' + 'constants');
// const Characters = require('./app/models/fandom/characters');
// const Religions = require('./app/models/fandom/religions');
// const Episodes = require('./app/models/fandom/episodes');
// const PageRanks = require('./app/models/fandom/pagerank');
// const CharacterFiller = require('./app/controllers/filler/fandom/charactersFandom');
// const EpisodeFiller = require('./app/controllers/filler/fandom/episodesFandom');
// const ReligionFiller = require('./app/controllers/filler/fandom/religionsFandom');
// const PageRankFiller = require('./app/controllers/filler/fandom/pagerankFandom');
// const EventFiller = require('./app/controllers/filler/fandom/eventFandom');
const UpdateFandom = require('./scripts/updateFandom');
const UpdateWesteros = require('./scripts/updateWesteros');
// const CharacterStore = require('../app/stores/fandom/characters');

const dbUrl = 'mongodb://127.0.0.1/gotdata';
// const dbUrl = 'mongodb://127.0.0.1/gottest';

const express = require('express'),
    app = express(),
    port = process.env.PORT || 3000,
    mongoose = require('mongoose'),
    cors = require('cors'),
    bodyParser = require('body-parser');

// mongoose instance connection url connection
mongoose.Promise = global.Promise;
mongoose.connect(dbUrl, {useNewUrlParser: true}).then(
    (res) => {
        console.log("Successfully connected to the database.")
    }
).catch((err) => {
    console.log("Connection to database failed");
});


mongoose.connection.on('connected', async () => {
    try {
        const db = mongoose.connection.db;
        console.log('MongoDB default connection open to ' + dbUrl);
        let updateFandom = new UpdateFandom(db).basicUpdate()
        let updateWesteros = new UpdateWesteros(db).basicUpdate();
        await Promise.all([await updateFandom, await updateWesteros]);

    } catch(e) {
        console.log(e);
    }
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors({
    "origin": "*",
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    "preflightContinue": false
}));

const showRouter = express.Router();
const bookRouter = express.Router();

require('./app/routes/fandomRoutes')(app, showRouter);
require('./app/routes/westerosRoutes')(app, bookRouter);

app.use('/api/show', showRouter);
app.use('/api/book', bookRouter);

app.use('/api', express.static('apiref.html'));

app.use(function(req, res) {
    res.status(404).send({url: req.originalUrl + ' not found'})
});

app.listen(port);

console.log('RESTful API server started on: ' + port);