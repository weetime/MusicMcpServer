const express = require('express');
const router = express.Router();
const searchRoutes = require('./search');
const healthRoutes = require('./health');

// Mount all route modules.
router.use('/', healthRoutes);
router.use('/', searchRoutes);

module.exports = router;

