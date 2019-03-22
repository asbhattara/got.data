
const CharacterStore = require('../../stores/fandom/characters');
class CharacterController {
    constructor() {
        this.charStore = new CharacterStore();
    }
    // ! 
    // async getMultiple(req, res) {
    //     let chars = await this.charStore.get()
    // }

    async getAll(req, res) {
        let chars = await this.charStore.getAll();
        res.status(200).send(chars)
    }
    
    async getByName(req, res) {
        let chars = await this.charStore.getByName(req.params.name);
        res.status(200).send(chars);
    }

    async getByHouse(req, res) {
        let chars = await this.charStore.getByHouse(req.params.house);
        res.status(200).send(chars);
    }
}
exports.module = CharacterController;