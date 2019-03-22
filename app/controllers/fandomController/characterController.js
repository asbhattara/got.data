
'use strict';
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
        if (chars.success === 1) {
            return res.status(200).send(chars.characters);
        } else {
            return res.status(404).send(chars.message);
        }
    }
    
    async getByName(req, res) {
        let chars = await this.charStore.getByName(req.params.name);
        if (chars.success === 1) {
            res.status(200).send(chars.characters);
        } else {
            res.status(404).send(chars.message);
        }
    }

    async getByHouse(req, res) {
        let chars = await this.charStore.getByHouse(req.params.house);
        if (chars.success === 1) {
            res.status(200).send(chars.characters);
        } else {
            res.status(404).send(chars.message);
        }
    }
}
module.exports = CharacterController;