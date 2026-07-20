/**
 * middleware/notFound.js
 * ---------------------------------------------
 * Catches all requests that did not match any
 * route and forwards a 404 ApiError to the
 * global error handler.
 * ---------------------------------------------
 */

const ApiError = require('../utils/ApiError');

const notFoundHandler = (req, res, next) => {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
};

module.exports = notFoundHandler;
