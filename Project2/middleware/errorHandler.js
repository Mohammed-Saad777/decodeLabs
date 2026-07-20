/**
 * middleware/errorHandler.js
 * ---------------------------------------------
 * Global error handling middleware.
 * Any error passed via `next(err)` ends up here.
 * ---------------------------------------------
 */

const ApiError = require('../utils/ApiError');

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  // Handle malformed JSON body from express.json()
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({
      success: false,
      status: 400,
      message: 'Invalid JSON payload',
    });
  }

  const isApiError = err instanceof ApiError;
  const statusCode = isApiError ? err.statusCode : err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  // Log the error server-side for debugging
  if (statusCode >= 500) {
    console.error('[ERROR]', err);
  }

  const payload = {
    success: false,
    status: statusCode,
    message,
  };

  if (isApiError && err.details) {
    payload.errors = err.details;
  }

  // Include the stack trace only in development mode
  if (process.env.NODE_ENV === 'development' && statusCode >= 500) {
    payload.stack = err.stack;
  }

  res.status(statusCode).json(payload);
};

module.exports = errorHandler;
