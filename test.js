require(__dirname + '/' + 'constants');

Filler = require("./app/controllers/filler/westeros/cities");
filler = new Filler(1);

filler.fill().then(function (data) {
    console.log(JSON.stringify(data, null, 2));
});