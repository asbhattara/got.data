require(__dirname + '/' + 'constants');

const config = require(__base + 'cfg/config');

const UpdateFandom = require(__base + '/scripts/updateFandom');
const UpdateWesteros = require(__base + '/scripts/updateWesteros');

function getDbString(config) { //Create the DB connection string
    let dbConnection = "mongodb://";
    if (config.username.length > 0 && config.password.length > 0) {
        dbConnection += config.username + ":" + config.password + "@";
    }
    return dbConnection + config.uri + ":" + config.port + "/" + config.db;
}

const express = require('express'),
    app = express(),
    port = process.env.PORT || 3000,
    mongoose = require('mongoose'),
    cors = require('cors'),
    bodyParser = require('body-parser');

// mongoose instance connection url connection
mongoose.Promise = global.Promise;
mongoose.connect(getDbString(config.database), {useNewUrlParser: true}).then(
    (res) => {
        console.log("Successfully connected to the database.")
    }
).catch((err) => {
    console.log("Connection to database failed");
});


mongoose.connection.on('connected', async () => {
    try {
        const db = mongoose.connection.db;
        console.log('MongoDB connection open');
        let updateFandom = new UpdateFandom(db).basicUpdate();
        let updateWesteros = new UpdateWesteros(db).basicUpdate();
        await Promise.all([updateFandom, updateWesteros]);
        console.log("all scraper done")
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