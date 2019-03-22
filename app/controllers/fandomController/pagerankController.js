
const PageRankStore = require('../../stores/fandom/pagerank');
class PageRankController {
    constructor() {
        this.rankStore = new PageRankStore();
    }

    async getAll(req, res) {
        let ranks = await this.rankStore.getAll();
        res.status(200).send(ranks)
    }
    
    async getByTitle(req, res) {
        let ranks = await this.rankStore.getByTitle(req.params.title);
        res.status(200).send(ranks);
    }
}
exports.module = PageRankController;