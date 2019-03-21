// TODO remove this file when not needed anymore

let Scraper = require(__appbase + 'controllers/scraper/westeros/ages');
let Age = require(__appbase + 'models/age');
let Ages = require(__appbase + 'stores/ages');
let jsonfile = require('jsonfile');
let async = require('async');
let cfg = require(__appbase + '../cfg/config.json');

module.exports = {
    fill: async function(policy, callback) {
        module.exports.policy = policy;
        console.log('Filling started.');

        let afterInsertion = function() {
            console.log('Filling done =).');
            callback(false);
        };

        let file = __tmpbase + 'ages.json';
        let scrape = function() {
            Scraper.scrapToFile(file, Scraper.getAll, function (err, obj) {
                if (err !== null) {
                    console.log(err);
                } else {
                    module.exports.insertToDb(obj.data,afterInsertion);
                }
            });
        };

        jsonfile.readFile(file, function(err, obj) {
            if(obj !== undefined) {
                let cacheAge = ((new Date()) - new Date(obj.createdAt));
                if(cacheAge > cfg.TTLWikiCache) {
                    console.log('Cache file outdated.');
                    scrape();
                } else {
                    console.log('Ages from cache file "'+file+'". Not scrapped from wiki.');
                    module.exports.insertToDb(obj.data,afterInsertion);
                }
            } else {
                scrape();
            }
        });
    },

    clearAll: async function() {
        return new Promise(function(resolve) {
            Age.remove({}, function(err) {
                if(err)
                {
                    throw err;
                }

                console.log('Ages collection removed');
                resolve(true);
            })
        });
    },

    matchToModel: function(age) {
        // go through the properties of the age
        for(let z in age) {
            // ignore references for now, later gather the ids and edit the entries
            if (!Age.schema.paths.hasOwnProperty(z)) {
                delete age[z];
            }

            // translate startDate to (negative) number
            if(z === 'startDate') {
                if(age[z].indexOf('BC')>-1) {
                    age[z] = 0 - age[z].replace(/[^0-9\.]/g, '');
                }
                else if(age[z].indexOf('AC')>-1) {
                    age[z] = age[z].replace(/[^0-9\.]/g, '');
                }
                else if(age[z].indexOf('ca')>-1) {
                    age[z] = age[z].replace('ca.','').replace(',','');
                }
                else {
                    delete age[z];
                }
            }

            // translate startDate to (negative) number
            if(z === 'endDate') {
                if(age[z].indexOf('BC')>-1) {
                    age[z] = 0 - age[z].replace(/[^0-9\.]/g, '');
                }
                else if(age[z].indexOf('282-283 AC')>-1) { //hardcoded =/
                    age[z] = 283;
                }
                else if(age[z].indexOf('AC')>-1) {
                    age[z] = age[z].replace(/[^0-9\.]/g, '');
                }
                else if(age[z].indexOf('~')>-1) {
                    age[z] = age[z].replace('~', '');
                }
                else if(age[z].indexOf('ca')>-1) {
                    age[z] = age[z].replace('ca.','').replace(',','').replace(' ','');
                }
                else {
                    delete age[z];
                }
            }

            // remove spaces and html tags
            if (typeof age[z] == 'string') {
                age[z] = age[z].trim().replace(/\*?<(?:.|\n)*?>/gm, '');
            }
        }

        return age;
    },
    insertToDb: async function(ages) {
        console.log('Inserting into db..');

        async function addAge(age) {
            return new Promise(function (resolve) {
                Ages.add(age, function (success, data) {
                    console.log((success !== 1) ? 'Problem:' + data : 'SUCCESS: ' + data.name);

                    resolve(true);
                });
            });
        }

        async function getAgeByName(agename) {
            return new Promise(function (resolve, reject) {
                Ages.getByName(agename, function(success, oldAge){
                    if(success !== 1)
                    {
                        resolve(null);
                    }
                    else
                    {
                        resolve(oldAge);
                    }
                });
            });
        }

        async function saveAge(obj) {
            return new Promise(function (resolve) {
                obj.save(function () {
                    resolve();
                })
            })
        }

        // delete the collection before the insertion?
        if(module.exports.policy === 1) {
            console.log("Delete and refill policy. Deleting collection..");

            await module.exports.clearAll();
        }

        for(let i = 0; i < ages.length; i++)
        {
            let age = ages[i];

            // name is required
            if (!age.hasOwnProperty('name')) {
                return;
            }

            age = module.exports.matchToModel(age);

            if(module.exports.policy === 1) { // empty db, so just add it
                await addAge(age);
            }
            else {
                // see if there is such an entry already in the db
                let oldAge = await getAgeByName(age.name);

                if(oldAge !== null) { // old entry is existing
                    let isChange = false;
                    // iterate through properties
                    for(let z in age) {
                        // only change if update policy or property is not yet stored
                        if(z !== "_id" && (module.exports.policy === 2 || oldAge[z] === undefined)) {
                            if(oldAge[z] === undefined) {
                                console.log("To old entry the new property "+z+" is added.");
                            }
                            oldAge[z] = age[z];
                            isChange = true;
                        }
                    }
                    if(isChange) {
                        console.log(age.name + " is updated.");
                        oldAge.updatedAt = new Date();

                        await saveAge(oldAge);
                    }
                    else {
                        console.log(age.name + " is untouched.");
                    }
                }
                else { // not existing, so it is added in every policy
                    await addAge(age);
                }
            }
        }
    }
};