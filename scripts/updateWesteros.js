const   CharacterFiller = require('../app/controllers/filler/westeros/characters'),
        CharacterPathFiller = require('../app/controllers/filler/westeros/characterPaths'),
        CharacterLocationFiller = require('../app/controllers/filler/westeros/characterLocations'),
        CityFiller = require('../app/controllers/filler/westeros/cities'),
        RegionFiller = require('../app/controllers/filler/westeros/regions'),
        AgeFiller = require('../app/controllers/filler/westeros/ages'),
        HouseFiller = require('../app/controllers/filler/westeros/houses'),
        CultureFiller = require('../app/controllers/filler/westeros/cultures'),
        ContinentFiller = require('../app/controllers/filler/westeros/contintents'),
        EventFiller = require('../app/controllers/filler/westeros/events');


class UpdateWesteros {
    constructor(db) {
        this.db = db;
        this.characterFiller = new CharacterFiller(1);
        this.characterPathFiller = new CharacterPathFiller(1);
        this.characterLocationFiller = new CharacterLocationFiller(1);
        this.cityFiller = new CityFiller(1);
        this.regionFiller = new RegionFiller(1);
        this.ageFiller = new AgeFiller(1);
        this.houseFiller = new HouseFiller(1);
        this.cultureFiller = new CultureFiller(1);
        this.continentFiller = new ContinentFiller(1);
        this.eventFiller = new EventFiller(1);

        this.collections = [
            'agewesteros', 
            'cities',
            'housewesteros',
            'characterwesteros',
            'characterlocationwesteros',
            'characterpathwesteros',
            'eventwesteros',
            'regions',
            'cultures',
            'continents'
        ];
    }

    async basicUpdate() {
        const self = this;
        this.db.listCollections().toArray(async (err, names) => {
            if (err) throw new Error(err);
            console.log('filling book collections');
            let filling = this.collections.map(async (collection) => {
                console.log('checking ' + collection);
                try {
                    switch (collection) {
                        case 'agewesteros':
                            await self.db.collection(collection).countDocuments(async function(err, count) {
                                if (err) throw new Error(err);
                                if( count == 0 ) {
                                    await self.ageFiller.fill();
                                }
                            });
                            break;
                        case 'housewesteros':
                            await self.db.collection(collection).countDocuments(async function(err, count) {
                                if (err) throw new Error(err);
                                if( count == 0 ) {
                                    await self.houseFiller.fill();
                                }
                            });
                            break;
                        case 'cities':
                            await self.db.collection(collection).countDocuments(async function(err, count) {
                                if (err) throw new Error(err);
                                if( count == 0 ) {
                                    await self.cityFiller.fill();
                                }
                            });
                            break;
                        case 'characterwesteros':
                            await self.db.collection(collection).countDocuments(async function(err, count) {
                                if (err) throw new Error(err);
                                if( count == 0 ) {
                                    await self.characterFiller.fill();
                                } else {
                                    await new CharacterFiller(3).fill();
                                }
                            });
                            break;
                        case 'characterlocationwesteros':
                            await self.db.collection(collection).countDocuments(async function(err, count) {
                                if (err) throw new Error(err);
                                if( count == 0 ) {
                                    await self.characterLocationFiller.fill();
                                }
                            });
                            break;
                        case 'characterpathwesteros':
                            await self.db.collection(collection).countDocuments(async function(err, count) {
                                if (err) throw new Error(err);
                                if( count == 0 ) {
                                    await self.characterPathFiller.fill();
                                }
                            });
                            break;
                        case 'regions':
                            await self.db.collection(collection).countDocuments(async function(err, count) {
                                if (err) throw new Error(err);
                                if( count == 0 ) {
                                    await self.regionFiller.fill();
                                }
                            });
                            break;
                        case 'cultures':
                            await self.db.collection(collection).countDocuments(async function(err, count) {
                                if (err) throw new Error(err);
                                if( count == 0 ) {
                                    await self.cultureFiller.fill();
                                }
                            });
                            break;
                        case 'eventwesteros':
                            await self.db.collection(collection).countDocuments(async function(err, count) {
                                if (err) throw new Error(err);
                                if( count == 0 ) {
                                    // await self.eventFiller.fill();
                                }
                            });
                            break;
                        case 'continents':
                            await self.db.collection(collection).countDocuments(async function(err, count) {
                                if (err) throw new Error(err);
                                if( count == 0 ) {
                                    await self.continentFiller.fill();
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