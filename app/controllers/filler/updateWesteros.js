const CharacterFiller = require('./westeros/characters'),
    CharacterPathFiller = require('./westeros/characterPaths'),
    CharacterLocationFiller = require('./westeros/characterLocations'),
    CharacterImageFiller = require('./westeros/characterImages'),
    CityFiller = require('./westeros/cities'),
    RegionFiller = require('./westeros/regions'),
    AgeFiller = require('./westeros/ages'),
    HouseFiller = require('./westeros/houses'),
    CultureFiller = require('./westeros/cultures'),
    ContinentFiller = require('./westeros/contintents'),
    RankFiller = require('./westeros/pagerank'),
    EventFiller = require('./westeros/events');


class UpdateWesteros {
    constructor(db) {
        this.db = db;
        this.characterFiller = new CharacterFiller(1);
        this.characterPathFiller = new CharacterPathFiller(1);
        this.characterLocationFiller = new CharacterLocationFiller(1);
        this.characterImageFiller = new CharacterImageFiller(1);
        this.cityFiller = new CityFiller(1);
        this.regionFiller = new RegionFiller(1);
        this.ageFiller = new AgeFiller(1);
        this.houseFiller = new HouseFiller(1);
        this.cultureFiller = new CultureFiller(1);
        this.continentFiller = new ContinentFiller(1);
        this.eventFiller = new EventFiller(1);
        this.rankFiller = new RankFiller(1);

        this.collections = [
            'agewesteros',
            'cities',
            'housewesteros',
            'characterwesteros',
            'characterlocationwesteros',
            'characterpathwesteros',
            'eventwesteros',
            'pagerankwesteros',
            'regions',
            'cultures',
            'continents',
            'images'
        ];
    }

    async basicUpdate() {
        const self = this;
        this.db.listCollections().toArray(async(err, names) => {
            if(err) throw new Error(err);
            console.log('filling book collections');
            let filling = this.collections.map(async(collection) => {
                console.log('checking ' + collection);
                try {
                    switch(collection) {
                        case 'agewesteros':
                            await self.db.collection(collection).countDocuments(async function (err, count) {
                                if(err) throw new Error(err);
                                if(count == 0) {
                                    console.log("filling " + collection);
                                    await self.ageFiller.fill();
                                }
                            });
                            break;
                        case 'housewesteros':
                            await self.db.collection(collection).countDocuments(async function (err, count) {
                                if(err) throw new Error(err);
                                if(count == 0) {
                                    console.log("filling " + collection);
                                    await self.houseFiller.fill();
                                }
                            });
                            break;
                        case 'cities':
                            await self.db.collection(collection).countDocuments(async function (err, count) {
                                if(err) throw new Error(err);
                                if(count == 0) {
                                    console.log("filling " + collection);
                                    await self.cityFiller.fill();
                                }
                            });
                            break;
                        case 'characterwesteros':
                            await self.db.collection(collection).countDocuments(async function (err, count) {
                                if(err) throw new Error(err);
                                if(count == 0) {
                                    console.log("filling " + collection);
                                    await self.characterFiller.fill();
                                } else {
                                    // await new CharacterFiller(3).fill();
                                }
                            });
                            break;
                        case 'characterlocationwesteros':
                            await self.db.collection(collection).countDocuments(async function (err, count) {
                                if(err) throw new Error(err);
                                if(count == 0) {
                                    console.log("filling " + collection);
                                    await self.characterLocationFiller.fill();
                                }
                            });
                            break;
                        case 'characterpathwesteros':
                            await self.db.collection(collection).countDocuments(async function (err, count) {
                                if(err) throw new Error(err);
                                if(count == 0) {
                                    console.log("filling " + collection);
                                    await self.characterPathFiller.fill();
                                }
                            });
                            break;
                        case 'pagerankwesteros':
                            await self.db.collection(collection).countDocuments(async function (err, count) {
                                if(err) throw new Error(err);
                                if(count == 0) {
                                    console.log("filling " + collection);
                                    await self.rankFiller.fill();
                                }
                            });
                            break;
                        case 'regions':
                            await self.db.collection(collection).countDocuments(async function (err, count) {
                                if(err) throw new Error(err);
                                if(count == 0) {
                                    console.log("filling " + collection);
                                    await self.regionFiller.fill();
                                }
                            });
                            break;
                        case 'cultures':
                            await self.db.collection(collection).countDocuments(async function (err, count) {
                                if(err) throw new Error(err);
                                if(count == 0) {
                                    console.log("filling " + collection);
                                    await self.cultureFiller.fill();
                                }
                            });
                            break;
                        case 'eventwesteros':
                            await self.db.collection(collection).countDocuments(async function (err, count) {
                                if(err) throw new Error(err);
                                if(count == 0) {
                                    console.log("filling " + collection);
                                    await self.eventFiller.fill();
                                }
                            });
                            break;
                        case 'continents':
                            await self.db.collection(collection).countDocuments(async function (err, count) {
                                if(err) throw new Error(err);
                                if(count == 0) {
                                    console.log("filling " + collection);
                                    await self.continentFiller.fill();
                                }
                            });
                            break;
                        case 'images':
                            let fs = require('fs');
                            let imgDir = __dirname + '/../../../misc/images/characters/book/';
                            await fs.readdir(imgDir, async(err, files) => {
                                if(err) throw new Error(err);
                                if(!files || files.length <= 1) {
                                    console.log('downloading book character images');
                                    await self.characterImageFiller.fill();
                                }
                            });
                            break;
                        default:
                            // console.log('Unknown collection in database... check updateWesteros.js');
                            // let fillers = [charFiller.fill(), epFiller.fill(), relFiller.fill(), rankFiller.fill()];
                            // let promises = fillers.map(async (job) => await job);
                            // await Promise.all(promises);
                            break;
                    }
                } catch(e) {
                    console.warn('error in fetching data ' + e);
                }
            });
            await Promise.all(filling);
            console.log('Finished fetching data.')
        });
    }
}

module.exports = UpdateWesteros;