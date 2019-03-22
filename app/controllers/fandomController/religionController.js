
const ReligionStore = require('../../stores/fandom/religions');
class ReligionController {
    constructor() {
        this.relStore = new ReligionStore();
    }

    async getAll(req, res) {
        let religions = await this.relStore.getAll();
        res.status(200).send(religions)
    }
    
    async getByTitle(req, res) {
        let religions = await this.relStore.getByName(req.params.name);
        res.status(200).send(religions);
    }
}
exports.module = ReligionController;