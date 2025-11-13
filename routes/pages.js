/**
 * Pages Routes
 * Handles serving HTML pages for web and mobile versions.
 */

const express = require('express');
const path = require('path');
const router = express.Router();
const detectDevice = require('../middleware/deviceDetection');

/**
 * Root route with device detection and auto-redirect.
 * GET /
 * - Mobile devices → redirect to /mobile/
 * - Desktop devices → redirect to /web/
 */
router.get('/', detectDevice, (req, res) => {
    if (req.isMobile) {
        res.redirect('/mobile/');
    } else {
        res.redirect('/web/');
    }
});

/**
 * Web/PC version route with device detection.
 * GET /web
 * - Mobile devices → redirect to /mobile/
 * - Desktop devices → serve PC version HTML
 */
router.get('/web', detectDevice, (req, res) => {
    if (req.isMobile) {
        // Redirect mobile devices to mobile version.
        res.redirect('/mobile/');
    } else {
        res.sendFile(path.join(__dirname, '../public/pc/index.html'));
    }
});

/**
 * Mobile version route.
 * GET /mobile
 * Serves mobile version HTML for all devices.
 */
router.get('/mobile', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/mobile/index.html'));
});

module.exports = router;

