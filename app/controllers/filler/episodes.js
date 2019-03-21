// TODO remove this file when not needed anymore

let Scraper = require(__appbase + 'controllers/scraper/episodes');
let Episode = require(__appbase + 'models/episode');
let Episodes = require(__appbase + 'stores/episodes');
let Character = require(__appbase + 'models/character');
let jsonfile = require('jsonfile');
let async = require('async');
let cfg = require(__appbase + '../cfg/config.json');

const FORCENEWCASTFILE = false; // only for testing purposes
let castFile = __appbase + '../data/cast.json';

module.exports = {
    fill: function(policy,callback) {
        module.exports.policy = policy;
        console.log('Filling started.');

        //load extra episodes from backup file
        let extraEpisodes = {};
        jsonfile.readFile(__appbase + 'data/episodesMissing.json', function(err, obj) {
            if(err) {
                return;
            }
            extraEpisodes = obj.data;
        });

        let afterInsertion = function() {
            let filler = require(__appbase + 'controllers/filler/episodes');
            filler.fillPreAndSuccessor(function(success) {
                filler.fillCast(function(err) {
                    console.log('Filling done =).');
                    callback(false);
                });
            });
        };

        let file = __tmpbase + 'episodes.json';
        let scrape = function(){
            Scraper.scrapToFile(file, Scraper.getAll, function (err, obj) {
                if (err !== null) {
                    console.log(err);
                } else {
                    module.exports.insertToDb(obj.data.concat(extraEpisodes), afterInsertion);
                }
            });
        };

        let afterCast = function() {
            jsonfile.readFile(file, function(err, obj) {
                if(err) {
                    scrape();
                    return;
                }
                let cacheAge = ((new Date()) - new Date(obj.createdAt));
                if(cacheAge > cfg.TTLWikiCache) {
                    console.log('Cache file outdated.');
                    scrape();
                } else {
                    console.log('Episodes from cache file "'+file+'". Not scrapped from wiki.');
                    module.exports.insertToDb(obj.data.concat(extraEpisodes), afterInsertion);
                }
            });
        };

        if(true) {
            Scraper.getCast(function(err,cast) {
                if(err) {
                    console.log('Could not get cast. Error: '+err);
                    afterCast();
                    return;
                }
                // get old one
                jsonfile.readFile(castFile, function(err, oldCast) {
                    // old one still up to date
                    if(!err && oldCast.data.length >= cast.data.length && !FORCENEWCASTFILE) {
                        if(oldCast.data.length > cast.data.length) {
                            console.log("Imdb scraper of the cast could be broken, because earlier more entires got scraped.");
                        }
                        console.log('Nothing new to scrap.');
                        afterCast();
                    }
                    else {
                        jsonfile.writeFile(castFile, cast, function (err) {
                            if(err) {
                                console.log('Could not write cast into file. Error: '+ err);
                            }
                            console.log('Cast is written into file: ' + castFile);
                            afterCast();
                        });
                    }

                });
            });
        }
        else {
            afterCast();
        }
    },
    clearAll: function(callback) {
        Episode.remove({}, function(err) {
            console.log('Episodes collection removed');
            callback();
        });
    },
    matchToModel: function(episode) {
        // go through the properties of the house
        for(let z in episode) {
            // ignore references for now, later gather the ids and edit the entries
            if ( z == 'episodes' || z == 'predecessor' || z == 'successor' || !Episode.schema.paths.hasOwnProperty(z)) {
                delete episode[z];
            }
            if(z == 'airDate') {
                let date = new Date(Date.parse(episode[z].replace('th','') + ' EDT'));
                if ( Object.prototype.toString.call(date) === "[object Date]" && isNaN( date.getTime() )) {
                    console.log('Could not translate date for airdate:' + episode[z] );
                    delete episode[z];
                }
                else {
                    episode[z] =  date;
                }
            }


            if(z == 'name') {
                episode[z] = episode[z].trim().replace(' (TV)', '');

            }

            // remove spaces and html tags
            if (typeof episode[z] == 'string') {
                episode[z] = episode[z].trim().replace(/\*?<(?:.|\n)*?>/gm, '');
            }
        }

        return episode;
    },
    insertToDb: function(episodes, callback) {
        console.log('Inserting into db..');

        let addEpisode = function(episode, callb) {
            Episodes.add(episode, function (success, data) {

                console.log((success != 1) ? 'Problem:' + data : 'SUCCESS: ' + data.name);
                callb(true);
            });
        };

        let insert = function (episodes) {
            // iterate through episodes
            async.forEach(episodes, function (episode, _callback) {
                    // name is required
                    if (!episode.hasOwnProperty('name')) {
                        _callback();
                        return;
                    }

                    episode = module.exports.matchToModel(episode);

                    if(module.exports.policy == 1) { // empty db, so just add it
                        addEpisode(episode, function(suc){ _callback(); });
                    }
                    else {
                        // see if there is such an entry already in the db
                        Episodes.getByName(episode.name,function(success,oldEpisode){

                            // fill characters
                            if(success == 1) { // old entry is existing
                                let isChange = false;
                                // iterate through properties
                                for(let z in episode) {
                                    // only change if update policy or property is not yet stored
                                    if(z != "_id" && (module.exports.policy == 2 || oldEpisode[z] === undefined)) {
                                        if(oldEpisode[z] === undefined) {
                                            console.log("To old entry the new property "+z+" is added.");
                                        }
                                        oldEpisode[z] = episode[z];
                                        isChange = true;
                                    }
                                }
                                if(isChange) {
                                    console.log(episode.name + " is updated.");
                                    oldEpisode.updatedAt = new Date();
                                    oldEpisode.save(function(err){
                                        _callback();
                                    });
                                }
                                else {
                                    console.log(episode.name + " is untouched.");
                                    _callback();
                                }
                            }
                            else { // not existing, so it is added in every policy
                                addEpisode(episode, function(suc){_callback();});
                            }
                        });

                    }
                },
                function (err) { callback(true); }
            );
        };

        // delete the collection before the insertion?
        if(module.exports.policy == 1) {
            console.log("Delete and refill policy. Deleting collection..");
            module.exports.clearAll(function() {insert(episodes);});
        }
        else {
            insert(episodes);
        }
    },
    fillPreAndSuccessor: function(callback) {
        console.log('Start filling pre- and successor.');
        Episodes.getAll(function(success,episodes) {
            // foreach episode
            async.forEach(episodes, function (episode, _callback) {
                let pre = episode.totalNr-1,
                    next = episode.totalNr+1;
                if(pre > 0) {
                    Episodes.get({'totalNr': pre},function(success,data) {
                       if(data.length>0)
                       {
                           let preEpisode = data[0];
                           if( preEpisode.name !== undefined) {
                               episode.predecessor = preEpisode.name;
                               episode.save(episode.id,function(err){});
                           }
                       }
                    });
                }
                if(next > 0) {
                    Episodes.get({'totalNr': next},function(success,data) {
                        if(data.length>0)
                        {
                            let nextEpisode = data[0];
                            if( nextEpisode.name !== undefined) {
                                episode.successor = nextEpisode.name;
                                episode.save(episode.id,function(err){});
                            }
                        }
                    });
                }
                _callback();
            },
            function (err) {
                callback(true);
            });
        });
    },
    fillCast: function(callback) {
        console.log('Start filling character appearances into db.');

        Episodes.getAll(function(success,episodes) {
            let noMatchesTo = [];
            // get cast from file:
            jsonfile.readFile(castFile, function(err, oldCast) {
                async.forEach(episodes, function (episode, _callback) {
                    let characters = [];
                    if(err) {
                        console.log('Problem with filling cast. Error: ' + err);
                        _callback();
                    }

                    let name, actor;
                    async.forEach(oldCast.data[episode.totalNr],function(entry,_callb){
                        name = entry.character;
                        actor = entry.actor;
                        Character.find({'name': {"$regex": name, "$options": "i"}}, function (err, char) {
                            console.log('Processing for episode ' + episode.totalNr + ' ..'); // to see that it not aborted.
                            if(err || char.length < 1) {
                                if(noMatchesTo.indexOf(name) == -1){
                                    noMatchesTo.push(name);
                                }
                                _callb();
                            }
                            else {
                                char = char[0];
                                char.actor = actor;
                                // save actor ;)
                                char.save(function(err) {

                                    characters.push(char.name);
                                    _callb();
                                });
                            }
                        });
                    },function(err) {
                        episode.characters = characters;
                        episode.save(function(err) {
                            if(!err){
                                console.log("Episode " + episode.name + " got updated with character appearances =)");
                            }
                            _callback();
                        });
                    });
                }, function (err) {
                    console.log('Could not match following to the db: ');
                    console.log(noMatchesTo);
                    callback(true);
                });
            });
        });
    }
};