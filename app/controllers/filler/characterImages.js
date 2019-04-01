// TODO remove this file when not needed anymore

let Scraper = require(__appbase + 'controllers/scraper/characters');
let Character = require(__appbase + 'models/character');
let Characters = require(__appbase + 'stores/characters');
let jsonfile = require('jsonfile');
let async = require('async');
let cfg = require(__base + 'cfg/config.json');

module.exports = {
    fill: function(policy, callback) {
        let cacheFile = __tmpbase + 'characters.json';
        console.log('Filling started.');

        async.waterfall([
            // check cache file
            function(cb) {
                jsonfile.readFile(cacheFile, function(err, obj) {
                    // no cache file
                    if(obj === undefined) {
                        cb(null, false); // scrap it!
                    }
                    else {

                        // cache outdated?
                        let cacheAge = ((new Date()) - new Date(obj.createdAt));
                        if(cacheAge > cfg.TTLWikiCache) {
                            console.log('Cache file is outdated!');
                            cb(null,false); // scrap it!
                        }
                        else {
                            console.log('Characters from cache file "'+cacheFile+'". Not scrapped from wiki.');
                            cb(null,obj.data);
                        }

                    }

                });
            },
            // scraping required?
            function(characters,cb) {
                // scraping if characters not yet fetched
                if(!characters) {
                    Scraper.scrapToFile(cacheFile, Scraper.getAll, function (err, obj) {
                        console.log('DONE WITH SCRAPING');
                        if (err !== null) {
                            console.log(err);
                        } else {
                            cb(null,obj.data);
                        }
                    });
                }
                else {
                    cb(null,characters);
                }
            },
            // downloading images
            function(characters,cb) {
                console.log('Start downloading images:');
                let charactersWithDownloadedImages = [];
                async.forEach(characters, function (character, _callback) {
                    if (character.imageLink !== undefined) {
                        module.exports.downloadImage(character, function (err, newImageLink) {
                            if (!err && newImageLink.length > 0) {
                                character.imageLink = newImageLink;
                            }
                            charactersWithDownloadedImages.push(character);
                            _callback();
                        });
                    }
                    else {
                        charactersWithDownloadedImages.push(character);
                        _callback();
                    }
                }, function(err) {
                    if(err) {
                        console.log(err);
                    }
                    console.log('Finished downloading images');
                    cb(null, charactersWithDownloadedImages);
                });
            },
            function(characters,cb) {
                module.exports.insertToDb(characters,function(err) {
                    if(err) {
                        console.log(err);
                    }
                    console.log('Filling done =).');
                    callback(false);
                });
            }
        ]);
    },
    clearAll: function(callback) {
        Character.remove({}, function(err) {
            console.log('Characters collection removed');
            callback();
        });
    },
    downloadImage: function(character,cb) {
        let fs = require('fs'),
            request = require('request');
        let uri = 'http://awoiaf.westeros.org/' + character.imageLink;
        let filename = '/misc/images/characters/' + character.name.replace(new RegExp(" ", "g"),"_");
        console.log('Downloading: ' + uri);
        request.head(uri, function(err, res, body){
            if(!err) {
                let type = res.headers['content-type'].replace(new RegExp("/", "g"),'.');
                let downloadTo = filename+'.'+type;
                downloadTo = downloadTo.replace(".image",'');
                request(uri).pipe(fs.createWriteStream(__appbase + '..' + downloadTo)).on('close', function() {
                    cb(false,downloadTo);
                    console.log('Downloaded to: ' + downloadTo);
                });
            }
            else {
                cb(true,null);
            }
        });
    },
    insertToDb: function(characters, callback) {
        console.log('Updating imageLinks in the db..');

        // iterate through characters
        async.forEach(characters, function (character, _callback) {
            // name is required
            if (!character.hasOwnProperty('name') || character.name == 'undefined') {
                _callback(); // skip character
            }
            else {
                // get old character
                Character.findOne({'name': character.name}, function (err, oldCharacter) {
                    // old entry is not existing
                    if (err || oldCharacter === null) {
                        console.log('Character ' + character.name + ' is not existing yet! Update characters collection first!');
                        _callback();
                    }
                    // old entry is existing
                    else {
                        oldCharacter.imageLink = character.imageLink;
                        console.log(oldCharacter.name + ' image got updated!');
                        oldCharacter.save(function(err) {
                            if(err) {
                                console.log(err);
                            }
                            _callback();
                        });
                    }
                });
            }

        },
        function (err) {
            if(err) {
                console.log(err);
            }
            callback(false);
        });
    }
};