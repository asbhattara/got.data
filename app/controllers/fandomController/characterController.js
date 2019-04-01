
'use strict';
const CharacterStore = require('../../stores/fandom/characterStore');
class CharacterController {
    constructor() {
        this.charStore = new CharacterStore();
    }
    // ! 
    // async getMultiple(req, res) {
    //     let characters = await this.charStore.get()
    // }

    async getAll(req, res) {
        let characters = await this.charStore.getAll();
        if (characters.success === 1) {
            return res.status(200).send(characters.data);
        } else {
            return res.status(404).send(characters.message);
        }
    }
    
    async getByName(req, res) {
        let characters = await this.charStore.getByName(req.params.name);
        if (characters.success === 1) {
            res.status(200).send(characters.data);
        } else {
            res.status(404).send(characters.message);
        }
    }

    async getBySlug(req, res) {
        let characters = await this.charStore.getBySlug(req.params.slug);
        if (characters.success === 1) {
            res.status(200).send(characters.data);
        } else {
            res.status(404).send(characters.message);
        }
    }

    async getByHouse(req, res) {
        let characters = await this.charStore.getByHouse(req.params.house);
        if (characters.success === 1) {
            res.status(200).send(characters.data);
        } else {
            res.status(404).send(characters.message);
        }
    }

    async updatePlod(req, res) {
        let slug = req.params.slug ? req.params.slug : req.body.slug;
        let plod = req.params.plod ? req.params.plod : req.body.plod;
        let character = await this.charStore.updatePlod(slug, plod);
        if (character.success === 1) {
            res.status(200).send(character.message);
        } else {
            res.status(404).send(character.message);
        } 
    }
}
module.exports = CharacterController;