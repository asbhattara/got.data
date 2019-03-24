const CharacterFiller = require('../app/controllers/filler/fandom/characters');
const EpisodeFiller = require('../app/controllers/filler/fandom/episodes');
const ReligionFiller = require('../app/controllers/filler/fandom/religions');
const PageRankFiller = require('../app/controllers/filler/fandom/pagerank');


class UpdateFandom {
    constructor(db) {
        this.db = db;
        this.charFiller = new CharacterFiller();
        this.epFiller = new EpisodeFiller();
        this.relFiller = new ReligionFiller();
        this.rankFiller = new PageRankFiller();
    }

    async basicUpdate() {
        this.db.listCollections().toArray(async (err, names) => {
            if (err) throw new Error(err);
            console.log('filling collections');
            if (names.length === 0) {
                let fillers = [charFiller.fill, epFiller.fill, relFiller.fill, rankFiller.fill];
                let promises = fillers.map(async (job) => await job());
                return await Promise.all(promises);
            }
            let filling = names.map(async (collection) => {
                console.log(collection.name);
                try {
                    switch (collection.name) {
                        case 'characters':
                            await this.db.collection(collection.name).countDocuments(async function(err, count) {
                                if (err) throw new Error(err);
                                if( count == 0 ) {
                                    await charFiller.fill();
                                }
                            });
                            break;
                        case 'religions':
                            await this.db.collection(collection.name).countDocuments(async function(err, count) {
                                if (err) throw new Error(err);
                                if( count == 0 ) {
                                    await relFiller.fill();
                                }
                            });
                            break;
                        case 'pageranks':
                            await this.db.collection(collection.name).countDocuments(async function(err, count) {
                                if (err) throw new Error(err);
                                if( count == 0 ) {
                                    await rankFiller.fill();
                                }
                            });
                            break;
                        case 'episodes':
                            await this.db.collection(collection.name).countDocuments(async function(err, count) {
                                if (err) throw new Error(err);
                                if( count == 0 ) {
                                    await epFiller.fill();
                                }
                            });
                            break;
                        default:
                            console.log('No collections available - scraping everything...');
                            let fillers = [charFiller.fill(), epFiller.fill(), relFiller.fill(), rankFiller.fill()];
                            let promises = fillers.map(async (job) => await job);
                            await Promise.all(promises);
                            break;
                    }
                } catch(e) {
                    res.status(404).send({ message: 'error in fetching data ' + e })
                }
            });
            await Promise.all(filling);
            console.log('Finished fetching data.')
        });
    }
}
module.exports = UpdateFandom;