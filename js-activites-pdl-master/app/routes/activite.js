/* Load Modules */
const express = require('express');
const router = express.Router();

/* Load controller */
const ActiviteController = require('../controller/activiteController');
const activiteController = new ActiviteController();

/**
 * Activite search routes
 */
router.get('', function(req, res) { activiteController.find(req, res) });

module.exports = router;