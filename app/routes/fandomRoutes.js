'use strict';
const   CharacterController = require('../controllers/fandomController/characterController'),
        ReligionController = require('../controllers/fandomController/religionController'),
        EpisodeController = require('../controllers/fandomController/episodeController'),
        PageRankController = require('../controllers/fandomController/pagerankController');


module.exports = function(app, router) {

    const charController = new CharacterController();
    router.get('/characters', charController.getAll);
    router.get('/character/:name', charController.getByName);
    router.get('/character/:house', charController.getByHouse);

    const epController = new EpisodeController();
    router.get('/episodes', epController.getAll);
    router.get('/episodes/:title', epController.getByTitle);

    const relController = new ReligionController();
    router.get('/religions', relController.getAll);
    router.get('/religions/:name', relController.getByName);

    const rankController = new PageRankController();
    router.get('/ranks', rankController.getAll);
    router.get('/ranks/:title', rankController.getByTitle);

}


