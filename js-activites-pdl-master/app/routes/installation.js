/* Load Modules */
const express = require('express');
const router = express.Router();

/* Load controller */
const InstallationController = require('../controller/installationController');
const installationController = new InstallationController();

/**
 * Installation routes
 */
router.get('', function(req, res) { installationController.find(req, res) });

module.exports = router;