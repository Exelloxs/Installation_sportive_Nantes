/**
 * Express Router configuration
 */
const express = require('express');
const router = express.Router();

router.use('/ville', require('./ville.js'));
router.use('/installation', require('./installation.js'));
router.use('/activite', require('./activite.js'));

module.exports = router;
