/**
 * Error Handling Middleware
 * Handles errors and sends appropriate JSON responses.
 */

/**
 * Global error handling middleware.
 * Should be the last middleware in the chain.
 */
function errorHandler(err, req, res, next) {
    console.error('Error:', err.message);
    res.status(err.status || 500).json({
        error: {
            message: err.message || 'Internal server error',
            status: err.status || 500
        }
    });
}

module.exports = errorHandler;

