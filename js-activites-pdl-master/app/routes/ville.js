/* Load Modules */
const express = require('express');
const router = express.Router();

/* Load controller */
const VilleController = require('../controller/villeController');
const villeController = new VilleController();

/**
 * Ville search routes
 */
router.get('', function(req, res) { villeController.find(req, res) });

module.exports = router;