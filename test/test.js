'use strict';
const Characters = require('../app/models/fandom/characters');
const Religions = require('../app/models/fandom/religions');
const Episodes = require('../app/models/fandom/episodes');
const PageRanks = require('../app/models/fandom/pagerank');
const CharacterFiller = require('../app/controllers/filler/fandom/characters');
const EpisodeFiller = require('../app/controllers/filler/fandom/episodes');
const ReligionFiller = require('../app/controllers/filler/fandom/religions');
const PageRankFiller = require('../app/controllers/filler/fandom/pagerank');
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

mongoose.connection.on('connected', () => {
    console.log('MongoDB default connection open to ' + dbUrl);

    mongoose.connection.db.listCollections().toArray((err, names) => {
        if (err) throw new Error(err);
        let filling = names.map(async collection => {
            try {
                switch (collection.name) {
                    case 'Characters':
                        mongoose.connection.db.collection(collection.name).count(function(err, count) {
                            if (err) throw new Error(err);
                            if( count == 0 ) {
                                await charFiller.fill();
                            }
                            break;
                        });
                    case 'Religions':
                        mongoose.connection.db.collection(collection.name).count(function(err, count) {
                            if (err) throw new Error(err);
                            if( count == 0 ) {
                                await relFiller.fill();
                            }
                            break;
                        });
                    case 'PageRanks':
                        mongoose.connection.db.collection(collection.name).count(function(err, count) {
                            if (err) throw new Error(err);
                            if( count == 0 ) {
                                await rankFiller.fill();
                            }
                            break;
                        });
                    case 'Episodes':
                        mongoose.connection.db.collection(collection.name).count(function(err, count) {
                            if (err) throw new Error(err);
                            if( count == 0 ) {
                                await epFiller.fill();
                            }
                            break;
                        });
                        break;
                    default:
                        let fillers = [charFiller.fill, epFiller.fill, relFiller.fill, rankFiller.fill];
                        await Promise.all(fillers);
                        break;
                }
            } catch(e) {
                console.log(e);
            }
        });
        await Promise.all(filling);
    });
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


const showRouter = express.Router();
const bookRouter = express.Router();

require('../app/routes/fandomRoutes')(app, showRouter);
require('../app/routes/awoiafRoutes')(app, bookRouter);
// const fandomRoutes = require('../app/routes/fandomRoutes').default; //importing route
// const awoiafRoutes = require('../app/routes/awoiafRoutes');
// fandomRoutes(app); //register the route
// awoiafRoutes(app);
app.use('/api/show', showRouter);
app.use('/api/books', bookRouter);

app.use(function(req, res) {
    res.status(404).send({url: req.originalUrl + ' not found'})
});

app.listen(port);

console.log('RESTful API server started on: ' + port);


// rankFiller.fill();
// charFiller.fill();
// epFiller.fill();
// relFiller.fill();

// Characters.find({})
// .populate({ path: 'pagerank', select: 'title rank'})
// // .populate('ranking')
// .exec(function(err, data) {
//     if(err) {
//         console.warn(err);
//     } else {
//         console.log(data);
//         // data.forEach(element => {
//         //     console.log(element['pagerank'])
//         // })
//     }
// })


// const charStore = new CharacterStore();
// charStore.getByHouse('Starks').then(char => {
//     console.log(char);
// });
// charStore.getAll().then(characters => {
//     console.log(characters);
// });