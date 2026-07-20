/**
 * middleware/validateStudent.js
 * ---------------------------------------------
 * Reusable validation middleware for student
 * create / update requests.
 *
 * - validateCreateStudent: all fields required
 * - validateUpdateStudent: at least 1 field
 *   required; only provided fields are validated
 * ---------------------------------------------
 */

const validator = require('validator');
const ApiError = require('../utils/ApiError');

/**
 * Run a set of validator functions and collect errors.
 * Each rule returns null if valid, or a string message if invalid.
 */
const runRules = (body, rules) => {
  const errors = [];
  for (const rule of rules) {
    const msg = rule(body);
    if (msg) errors.push(msg);
  }
  return errors;
};

/* ---------- Field-level validators ---------- */

const nameRule = (required) => (body) => {
  if (body.name === undefined) {
    return required ? 'name is required' : null;
  }
  if (typeof body.name !== 'string' || body.name.trim().length === 0) {
    return 'name must be a non-empty string';
  }
  if (body.name.trim().length > 100) {
    return 'name must be at most 100 characters';
  }
  return null;
};

const emailRule = (required) => (body) => {
  if (body.email === undefined) {
    return required ? 'email is required' : null;
  }
  if (typeof body.email !== 'string' || !validator.isEmail(body.email.trim())) {
    return 'email must be a valid email address';
  }
  return null;
};

const ageRule = (required) => (body) => {
  if (body.age === undefined) {
    return required ? 'age is required' : null;
  }
  const ageNum = Number(body.age);
  if (!Number.isFinite(ageNum) || !Number.isInteger(ageNum)) {
    return 'age must be an integer';
  }
  if (ageNum < 16 || ageNum > 60) {
    return 'age must be between 16 and 60';
  }
  return null;
};

const courseRule = (required) => (body) => {
  if (body.course === undefined) {
    return required ? 'course is required' : null;
  }
  if (typeof body.course !== 'string' || body.course.trim().length === 0) {
    return 'course must be a non-empty string';
  }
  if (body.course.trim().length > 100) {
    return 'course must be at most 100 characters';
  }
  return null;
};

/* ---------- Middlewares ---------- */

const validateCreateStudent = (req, res, next) => {
  const body = req.body || {};
  const errors = runRules(body, [
    nameRule(true),
    emailRule(true),
    ageRule(true),
    courseRule(true),
  ]);

  if (errors.length) {
    return next(new ApiError(400, 'Validation failed', errors));
  }
  next();
};

const validateUpdateStudent = (req, res, next) => {
  const body = req.body || {};
  const allowedFields = ['name', 'email', 'age', 'course'];
  const providedFields = Object.keys(body).filter((k) => allowedFields.includes(k));

  if (providedFields.length === 0) {
    return next(
      new ApiError(
        400,
        'Validation failed',
        ['At least one of name, email, age, course must be provided']
      )
    );
  }

  const errors = runRules(body, [
    nameRule(false),
    emailRule(false),
    ageRule(false),
    courseRule(false),
  ]);

  if (errors.length) {
    return next(new ApiError(400, 'Validation failed', errors));
  }
  next();
};

module.exports = {
  validateCreateStudent,
  validateUpdateStudent,
};
