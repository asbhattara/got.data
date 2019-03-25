'use strict';
const Characters = require('../app/models/fandom/characters');
const Religions = require('../app/models/fandom/religions');
const Episodes = require('../app/models/fandom/episodes');
const PageRanks = require('../app/models/fandom/pagerank');
const CharacterFiller = require('../app/controllers/filler/fandom/charactersFandom');
const EpisodeFiller = require('../app/controllers/filler/fandom/episodesFandom');
const ReligionFiller = require('../app/controllers/filler/fandom/religionsFandom');
const PageRankFiller = require('../app/controllers/filler/fandom/pagerankFandom');
const UpdateFandom = require('../scripts/updateFandom');
// const CharacterStore = require('../app/stores/fandom/characters');

const dbUrl = 'mongodb://127.0.0.1/gotdata';
// const dbUrl = 'mongodb://127.0.0.1/gottest';

const express = require('express'),
    app = express(),
    port = process.env.PORT || 3000,
    mongoose = require('mongoose'),
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

// const charFiller = new CharacterFiller();
// const epFiller = new EpisodeFiller();
// const relFiller = new ReligionFiller();
// const rankFiller = new PageRankFiller();

mongoose.connection.on('connected', async () => {
    try {
        console.log('MongoDB default connection open to ' + dbUrl);
        await new UpdateFandom(mongoose.connection.db).basicUpdate();
        // await updateFandom.basicUpdate();
    } catch(e) {
        console.log(e);
    }
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


const showRouter = express.Router();
const bookRouter = express.Router();

require('../app/routes/fandomRoutes')(app, showRouter);
// ! old routes not working atm
// require('../app/routes/awoiafRoutes')(app, bookRouter);

// const fandomRoutes = require('../app/routes/fandomRoutes').default; //importing route
// const awoiafRoutes = require('../app/routes/awoiafRoutes');
// fandomRoutes(app); //register the route
// awoiafRoutes(app);
app.use('/api/show', showRouter);
// TODO fix old routes
// app.use('/api/books', bookRouter);

app.use('/api', express.static('apiref.html'));

app.use(function(req, res) {
    res.status(404).send({url: req.originalUrl + ' not found'})
});

app.listen(port);

console.log('RESTful API server started on: ' + port);