'use strict';
const Characters = require('../app/models/fandom/characters');
const Religions = require('../app/models/fandom/religions');
const Episodes = require('../app/models/fandom/episodes');
const PageRanks = require('../app/models/fandom/pagerank');
const CharacterFiller = require('../app/controllers/filler/fandom/characters');
const EpisodeFiller = require('../app/controllers/filler/fandom/episodes');
const ReligionFiller = require('../app/controllers/filler/fandom/religions');
const PageRankFiller = require('../app/controllers/filler/fandom/pagerank');
const UpdateFandom = require('../scripts/updateFandom');
// const CharacterStore = require('../app/stores/fandom/characters');

const dbUrl = 'mongodb://127.0.0.1/gotdata';

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

const charFiller = new CharacterFiller();
const epFiller = new EpisodeFiller();
const relFiller = new ReligionFiller();
const rankFiller = new PageRankFiller();

mongoose.connection.on('connected', async () => {
    try {
        console.log('MongoDB default connection open to ' + dbUrl);
        await new UpdateFandom(mongoose.connection.db).basicUpdate();
    } catch(e) {
        console.log(e);
    }
    
    // mongoose.connection.db.listCollections().toArray(async (err, names) => {
    //     if (err) throw new Error(err);
    //     console.log('filling collections');
    //     if (names.length === 0) {
    //         let fillers = [charFiller.fill, epFiller.fill, relFiller.fill, rankFiller.fill];
    //         let promises = fillers.map(async (job) => await job());
    //         return await Promise.all(promises);
    //     }
    //     let filling = names.map(async (collection) => {
    //         console.log(collection.name);
    //         try {
    //             switch (collection.name) {
    //                 case 'characters':
    //                     await mongoose.connection.db.collection(collection.name).countDocuments(async function(err, count) {
    //                         if (err) throw new Error(err);
    //                         if( count == 0 ) {
    //                             await charFiller.fill();
    //                         }
    //                     });
    //                     break;
    //                 case 'religions':
    //                     await mongoose.connection.db.collection(collection.name).countDocuments(async function(err, count) {
    //                         if (err) throw new Error(err);
    //                         if( count == 0 ) {
    //                             await relFiller.fill();
    //                         }
    //                     });
    //                     break;
    //                 case 'pageranks':
    //                     await mongoose.connection.db.collection(collection.name).countDocuments(async function(err, count) {
    //                         if (err) throw new Error(err);
    //                         if( count == 0 ) {
    //                             await rankFiller.fill();
    //                         }
    //                     });
    //                     break;
    //                 case 'episodes':
    //                     await mongoose.connection.db.collection(collection.name).countDocuments(async function(err, count) {
    //                         if (err) throw new Error(err);
    //                         if( count == 0 ) {
    //                             await epFiller.fill();
    //                         }
    //                     });
    //                     break;
    //                 default:
    //                     console.log('No collections available - scraping everything...');
    //                     let fillers = [charFiller.fill(), epFiller.fill(), relFiller.fill(), rankFiller.fill()];
    //                     let promises = fillers.map(async (job) => await job);
    //                     await Promise.all(promises);
    //                     break;
    //             }
    //         } catch(e) {
    //             res.status(404).send({ message: 'error in fetching data ' + e })
    //         }
    //     });
    //     await Promise.all(filling);
    //     console.log('Finished fetching data.')
    // });
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

app.use('/api', express.static('api.html'));

app.use(function(req, res) {
    res.status(404).send({url: req.originalUrl + ' not found'})
});

app.listen(port);

console.log('RESTful API server started on: ' + port);