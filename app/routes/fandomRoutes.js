const   CharacterController = require('../controllers/fandomController/characterController'),
        ReligionController = require('../controllers/fandomController/religionController'),
        EpisodeController = require('../controllers/fandomController/episodeController'),
        PageRankController = require('../controllers/fandomController/pagerankController');


module.exports = function(app, router) {

    const charController = new CharacterController();
    router.get('/character', charController.getAll.bind(charController));
    router.get('/character/:name', charController.getByName.bind(charController));
    router.get('/character/:house', charController.getByHouse.bind(charController));

    const epController = new EpisodeController();
    router.get('/episodes', epController.getAll.bind(epController));
    router.get('/episodes/:title', epController.getByTitle.bind(epController));

    const relController = new ReligionController();
    router.get('/religions', relController.getAll.bind(relController));
    router.get('/religions/:title', relController.getByTitle.bind(relController));

    const rankController = new PageRankController();
    router.get('/ranks', rankController.getAll.bind(rankController));
    router.get('/ranks/:title', rankController.getByTitle.bind(rankController));

}


