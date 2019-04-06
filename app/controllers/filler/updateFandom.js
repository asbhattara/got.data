const CharacterFiller = require('./fandom/charactersFandom'),
    EpisodeFiller = require('./fandom/episodesFandom'),
    ReligionFiller = require('./fandom/religionsFandom'),
    PageRankFiller = require('./fandom/pagerankFandom'),
    AnimalFiller = require('./fandom/animalFandom'),
    AssassinFiller = require('./fandom/assassinFandom'),
    BastardFiller = require('./fandom/bastardFandom'),
    BattleFiller = require('./fandom/battleFandom'),
    CastleFiller = require('./fandom/castleFandom'),
    CityFiller = require('./fandom/cityFandom'),
    RegionFiller = require('./fandom/regionFandom'),
    TownFiller = require('./fandom/townFandom'),
    AgeFiller = require('./fandom/ageFandom'),
    HouseFiller = require('./fandom/houseFandom'),
    EventFiller = require('./fandom/eventFandom'),
    CharacterImageFiller = require('./fandom/characterImages');


class UpdateFandom {
    constructor(db) {
        this.db = db;
        this.characterFiller = new CharacterFiller(1);
        this.characterImageFiller = new CharacterImageFiller(1);
        this.episodeFiller = new EpisodeFiller();
        this.religionFiller = new ReligionFiller();
        this.rankFiller = new PageRankFiller();
        this.animalFiller = new AnimalFiller();
        this.assassinFiller = new AssassinFiller();
        this.bastardFiller = new BastardFiller();
        this.battleFiller = new BattleFiller();
        this.castleFiller = new CastleFiller();
        this.cityFiller = new CityFiller();
        this.regionFiller = new RegionFiller();
        this.townFiller = new TownFiller();
        this.ageFiller = new AgeFiller();
        this.houseFiller = new HouseFiller();
        this.eventFiller = new EventFiller();

        this.collections = [
            'agefandoms',
            'animalfandoms',
            'housefandoms',
            'assassinfandoms',
            'bastardfandoms',
            'battlefandoms',
            'castlefandoms',
            'cityfandoms',
            'characterfandoms',
            'eventfandoms',
            'religionfandoms',
            'regionfandoms',
            'pagerankfandoms',
            'episodefandoms',
            'townfandoms'
        ];
    }

    async basicUpdate() {
        const self = this;
        this.db.listCollections().toArray(async(err, names) => {
            if(err) throw new Error(err);
            console.log('filling show collections');
            let filling = this.collections.map(async(collection) => {
                // console.log('checking ' + collection.name);
                console.log('checking ' + collection);
                try {
                    switch(collection) {
                        case 'agefandoms':
                            return new Promise((resolve => {
                                self.db.collection(collection).countDocuments(function (err, count) {
                                    if(err) throw new Error(err);

                                    if(count === 0) {
                                        console.log("filling " + collection);
                                        self.ageFiller.fill().then(() => { resolve() });
                                    } else {
                                        resolve();
                                    }
                                });
                            }));
                        case 'housefandoms':
                            return new Promise((resolve => {
                                self.db.collection(collection).countDocuments(function (err, count) {
                                    if(err) throw new Error(err);

                                    if(count === 0) {
                                        console.log("filling " + collection);
                                        self.houseFiller.fill().then(() => { resolve() });
                                    } else {
                                        resolve();
                                    }
                                });
                            }));
                        case 'animalfandoms':
                            return new Promise((resolve => {
                                self.db.collection(collection).countDocuments(function (err, count) {
                                    if(err) throw new Error(err);

                                    if(count === 0) {
                                        console.log("filling " + collection);
                                        self.animalFiller.fill().then(() => { resolve() });
                                    } else {
                                        resolve();
                                    }
                                });
                            }));
                        case 'assassinfandoms':
                            return new Promise((resolve => {
                                self.db.collection(collection).countDocuments(function (err, count) {
                                    if(err) throw new Error(err);

                                    if(count === 0) {
                                        console.log("filling " + collection);
                                        self.assassinFiller.fill().then(() => { resolve() });
                                    } else {
                                        resolve();
                                    }
                                });
                            }));
                        case 'bastardfandoms':
                            return new Promise((resolve => {
                                self.db.collection(collection).countDocuments(function (err, count) {
                                    if(err) throw new Error(err);

                                    if(count === 0) {
                                        console.log("filling " + collection);
                                        self.bastardFiller.fill().then(() => { resolve() });
                                    } else {
                                        resolve();
                                    }
                                });
                            }));
                        case 'battlefandoms':
                            return new Promise((resolve => {
                                self.db.collection(collection).countDocuments(function (err, count) {
                                    if(err) throw new Error(err);

                                    if(count === 0) {
                                        console.log("filling " + collection);
                                        self.battleFiller.fill().then(() => { resolve() });
                                    } else {
                                        resolve();
                                    }
                                });
                            }));
                        case 'castlefandoms':
                            return new Promise((resolve => {
                                self.db.collection(collection).countDocuments(function (err, count) {
                                    if(err) throw new Error(err);

                                    if(count === 0) {
                                        console.log("filling " + collection);
                                        self.castleFiller.fill().then(() => { resolve() });
                                    } else {
                                        resolve();
                                    }
                                });
                            }));
                        case 'cityfandoms':
                            return new Promise((resolve => {
                                self.db.collection(collection).countDocuments(function (err, count) {
                                    if(err) throw new Error(err);

                                    if(count === 0) {
                                        console.log("filling " + collection);
                                        self.cityFiller.fill().then(() => { resolve() });
                                    } else {
                                        resolve();
                                    }
                                });
                            }));
                        case 'characterfandoms':
                            return new Promise((resolve => {
                                self.db.collection(collection).countDocuments(function (err, count) {
                                    if(err) throw new Error(err);

                                    if(count === 0) {
                                        console.log("filling " + collection);
                                        self.characterFiller.fill().then(() => { resolve() });
                                    } else {
                                        resolve();
                                    }
                                });
                            }));
                        case 'eventfandoms':
                            return new Promise((resolve => {
                                self.db.collection(collection).countDocuments(function (err, count) {
                                    if(err) throw new Error(err);

                                    if(count === 0) {
                                        console.log("filling " + collection);
                                        self.eventFiller.fill().then(() => { resolve() });
                                    } else {
                                        resolve();
                                    }
                                });
                            }));
                        case 'religionfandoms':
                            return new Promise((resolve => {
                                self.db.collection(collection).countDocuments(function (err, count) {
                                    if(err) throw new Error(err);

                                    if(count === 0) {
                                        console.log("filling " + collection);
                                        self.religionFiller.fill().then(() => { resolve() });
                                    } else {
                                        resolve();
                                    }
                                });
                            }));
                        case 'pagerankfandoms':
                            return new Promise((resolve => {
                                self.db.collection(collection).countDocuments(function (err, count) {
                                    if(err) throw new Error(err);

                                    if(count === 0) {
                                        console.log("filling " + collection);
                                        self.rankFiller.fill().then(() => { resolve() });
                                    } else {
                                        resolve();
                                    }
                                });
                            }));
                        case 'episodefandoms':
                            return new Promise((resolve => {
                                self.db.collection(collection).countDocuments(function (err, count) {
                                    if(err) throw new Error(err);

                                    if(count === 0) {
                                        console.log("filling " + collection);
                                        self.episodeFiller.fill().then(() => { resolve() });
                                    } else {
                                        resolve();
                                    }
                                });
                            }));
                        case 'regionfandoms':
                            return new Promise((resolve => {
                                self.db.collection(collection).countDocuments(function (err, count) {
                                    if(err) throw new Error(err);

                                    if(count === 0) {
                                        console.log("filling " + collection);
                                        self.regionFiller.fill().then(() => { resolve() });
                                    } else {
                                        resolve();
                                    }
                                });
                            }));
                        case 'townfandoms':
                            return new Promise((resolve => {
                                self.db.collection(collection).countDocuments(function (err, count) {
                                    if(err) throw new Error(err);

                                    if(count === 0) {
                                        console.log("filling " + collection);
                                        self.townFiller.fill().then(() => { resolve() });
                                    } else {
                                        resolve();
                                    }
                                });
                            }));
                        default:
                            return new Promise((resolve) => {resolve()});
                    }
                } catch(e) {
                    console.warn('error in fetching data ' + e);

                    return new Promise((resolve) => {resolve()});
                }
            });

            await Promise.all(filling);

            await new Promise(resolve => {
                console.log("checking images");

                let fs = require('fs');
                let imgDir = __dirname + '/../../../misc/images/characters/show/';
                fs.readdir(imgDir, (err, files) => {
                    if(err) throw new Error(err);

                    console.log(files.length);

                    if(!files || files.length <= 2) {
                        console.log('downloading show character images');

                        self.characterImageFiller.fill().then(() => {
                            resolve();
                        });
                    }
                    else
                    {
                        resolve();
                    }
                });
            });

            console.log('Finished fetching data.')
        });
    }
}

module.exports = UpdateFandom;