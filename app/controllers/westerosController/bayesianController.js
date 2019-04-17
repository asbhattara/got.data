const BayesianAttributeStore = require('../../stores/bayesianAttributes');

class BayesianAttributeController {
    constructor() {
        this.baStore = new BayesianAttributeStore();
    }


    async getAll(req, res) {
        let characters = await this.baStore.getByWiki('westeros');

        if(characters.success === STORE_RESPONSE_SUCCESS) {
            return res.status(200).send(characters.data);
        } else {
            return res.status(404).send(characters.message);
        }
    }

    async update(req, res) {
        let attributes = req.params.attributes ? req.params.attributes : req.body.attributes;

        let bayesianAttributes = await this.baStore.updateWiki('westeros', attributes);

        if(bayesianAttributes.success === STORE_RESPONSE_SUCCESS) {
            res.status(200).send(bayesianAttributes.message);
        } else {
            res.status(404).send(bayesianAttributes.message);
        }
    }
}

module.exports = BayesianAttributeController;