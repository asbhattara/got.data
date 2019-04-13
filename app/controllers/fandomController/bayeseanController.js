const BayeseanAttributeStore = require('../../stores/bayeseanAttributes');

class BayeseanAttributeController {
    constructor() {
        this.baStore = new BayeseanAttributeStore();
    }

    /**
     * @api {get} /api/show/bayesean-attributes Get all bayesean attributes
     * @apiVersion 0.0.2
     * @apiName GetAllBayeseanAttributesShow
     * @apiGroup BayeseanShow
     *
     * @apiSuccessExample {json} Success-Response
     *     HTTP/1.1 200 OK
     *     [{“House”: 0.3, “Age”: 0.8}, {..},..]
     * @apiSuccessExample {json} Empty-Success-Response
     *     HTTP/1.1 200 OK
     *     []
     * @apiErrorExample {json} NoData
     *      HTTP/1.1 404
     *      getAll(): Bayesean collection empty. Scraping should be started...
     * @apiErrorExample {json} ErrorInDatabase
     *      HTTP/1.1 404
     *      error in database query! - err
     * @apiDescription Return all bayesean attributes currently stored.
     */
    async getAll(req, res) {
        let characters = await this.baStore.getByWiki("fandom");

        if (characters.success === STORE_RESPONSE_SUCCESS) {
            return res.status(200).send(characters.data);
        } else {
            return res.status(404).send(characters.message);
        }
    }

    /**
     * @api {post} /api/show/bayesean-attributes/update Update Bayesean attributes
     * @apiVersion 0.0.2
     * @apiName UpdateBayeseanAttributesShow
     * @apiGroup BayeseanShow
     *
     * @apiSuccessExample {json} Success-Response
     *     HTTP/1.1 200 OK
     *     wiki has been updated
     * @apiErrorExample {json} ErrorInDatabase
     *     HTTP/1.1 404
     *     error in database query! - err
     * @apiDescription Update bayesean attributes.
     */
    async update(req, res) {
        let attributes = req.params.attributes ? req.params.attributes : req.body.attributes;

        let bayeseanAttributes = await this.baStore.updateWiki("fandom", attributes);

        if (bayeseanAttributes.success === STORE_RESPONSE_SUCCESS) {
            res.status(200).send(bayeseanAttributes.message);
        } else {
            res.status(404).send(bayeseanAttributes.message);
        }
    }
}

module.exports = BayeseanAttributeController;