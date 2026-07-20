/**
 * utils/asyncHandler.js
 * ---------------------------------------------
 * Small wrapper that forwards async controller
 * errors to Express's error handling middleware.
 * ---------------------------------------------
 */

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
