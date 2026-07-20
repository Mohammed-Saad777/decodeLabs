/**
 * utils/ApiError.js
 * ---------------------------------------------
 * Custom error class used across the app so the
 * global error handler can respond with the correct
 * HTTP status code and structured payload.
 * ---------------------------------------------
 */

class ApiError extends Error {
  /**
   * @param {number} statusCode HTTP status code (e.g. 400, 404, 500)
   * @param {string} message   Human-readable message
   * @param {Array}  [details] Optional array of validation error details
   */
  constructor(statusCode, message, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.isOperational = true; // Marks errors that we threw intentionally
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ApiError;
