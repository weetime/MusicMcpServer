/**
 * Device Detection Middleware
 * Detects if the request is from a mobile device based on User-Agent.
 */

/**
 * Middleware to detect mobile devices.
 * Sets req.isMobile to true if the device is mobile.
 */
function detectDevice(req, res, next) {
    const userAgent = req.headers['user-agent'] || '';
    // Enhanced mobile detection pattern.
    const isMobile = /Mobile|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Windows Phone|webOS|CriOS|FxiOS/i.test(userAgent);
    req.isMobile = isMobile;
    next();
}

module.exports = detectDevice;

