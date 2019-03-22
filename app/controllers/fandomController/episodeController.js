
const EpisodeStore = require('../../stores/fandom/episodes');
class EpisodeController {
    constructor() {
        this.epStore = new EpisodeStore();
    }

    async getAll(req, res) {
        let episodes = await this.epStore.getAll();
        res.status(200).send(episodes)
    }
    
    async getByTitle(req, res) {
        let episodes = await this.epStore.getByTitle(req.params.title);
        res.status(200).send(episodes);
    }
}
exports.module = EpisodeController;