const   CharacterFiller = require('./fandom/charactersFandom'),
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
        EventFiller = require('./fandom/eventFandom');


class UpdateFandom {
    constructor(db) {
        this.db = db;
        this.characterFiller = new CharacterFiller(1);
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
        this.db.listCollections().toArray(async (err, names) => {
            if (err) throw new Error(err);
            console.log('filling show collections');
            let filling = this.collections.map(async (collection) => {
                // console.log('checking ' + collection.name);
                console.log('checking ' + collection);
                try {
                    switch (collection) {
                        case 'agefandoms':
                            await self.db.collection(collection).countDocuments(async function(err, count) {
                                if (err) throw new Error(err);
                                if( count == 0 ) {
                                    await self.ageFiller.fill();
                                }
                            });
                            break;
                        case 'housefandoms':
                            await self.db.collection(collection).countDocuments(async function(err, count) {
                                if (err) throw new Error(err);
                                if( count == 0 ) {
                                    await self.houseFiller.fill();
                                }
                            });
                            break;
                        case 'animalfandoms':
                            await self.db.collection(collection).countDocuments(async function(err, count) {
                                if (err) throw new Error(err);
                                if( count == 0 ) {
                                    await self.animalFiller.fill();
                                }
                            });
                            break;
                        case 'assassinfandoms':
                            await self.db.collection(collection).countDocuments(async function(err, count) {
                                if (err) throw new Error(err);
                                if( count == 0 ) {
                                    await self.assassinFiller.fill();
                                }
                            });
                            break;
                        case 'bastardfandoms':
                            await self.db.collection(collection).countDocuments(async function(err, count) {
                                if (err) throw new Error(err);
                                if( count == 0 ) {
                                    await self.bastardFiller.fill();
                                }
                            });
                            break;
                        case 'battlefandoms':
                            await self.db.collection(collection).countDocuments(async function(err, count) {
                                if (err) throw new Error(err);
                                if( count == 0 ) {
                                    await self.battleFiller.fill();
                                }
                            });
                            break;
                        case 'castlefandoms':
                            await self.db.collection(collection).countDocuments(async function(err, count) {
                                if (err) throw new Error(err);
                                if( count == 0 ) {
                                    await self.castleFiller.fill();
                                }
                            });
                            break;
                        case 'cityfandoms':
                            await self.db.collection(collection).countDocuments(async function(err, count) {
                                if (err) throw new Error(err);
                                if( count == 0 ) {
                                    await self.cityFiller.fill();
                                }
                            });
                            break;
                        case 'characterfandoms':
                            await self.db.collection(collection).countDocuments(async function(err, count) {
                                if (err) throw new Error(err);
                                if( count == 0 ) {
                                    await self.characterFiller.fill();
                                } else {
                                    await new CharacterFiller(3).fill();
                                }
                            });
                            break;
                        case 'eventfandoms':
                            await self.db.collection(collection).countDocuments(async function(err, count) {
                                if (err) throw new Error(err);
                                if( count == 0 ) {
                                    await self.eventFiller.fill();
                                }
                            });
                            break;
                        case 'religionfandoms':
                            await self.db.collection(collection).countDocuments(async function(err, count) {
                                if (err) throw new Error(err);
                                if( count == 0 ) {
                                    await self.religionFiller.fill();
                                }
                            });
                            break;
                        case 'pagerankfandoms':
                            await self.db.collection(collection).countDocuments(async function(err, count) {
                                if (err) throw new Error(err);
                                if( count == 0 ) {
                                    await self.rankFiller.fill();
                                }
                            });
                            break;
                        case 'episodefandoms':
                            await self.db.collection(collection).countDocuments(async function(err, count) {
                                if (err) throw new Error(err);
                                if( count == 0 ) {
                                    await self.episodeFiller.fill();
                                }
                            });
                            break;
                        case 'regionfandoms':
                            await self.db.collection(collection).countDocuments(async function(err, count) {
                                if (err) throw new Error(err);
                                if( count == 0 ) {
                                    await self.regionFiller.fill();
                                }
                            });
                            break;
                        case 'townfandoms':
                            await self.db.collection(collection).countDocuments(async function(err, count) {
                                if (err) throw new Error(err);
                                if( count == 0 ) {
                                    await self.townFiller.fill();
                                }
                            });
                            break;
                        default:
                            // console.log('Unknown collection in database... check updateFandom.js');
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
module.exports = UpdateFandom;