/**
 * routes/studentRoutes.js
 * ---------------------------------------------
 * Wires HTTP routes to controllers and applies
 * the appropriate validation middleware.
 * ---------------------------------------------
 */

const express = require('express');
const {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
} = require('../controllers/studentController');

const {
  validateCreateStudent,
  validateUpdateStudent,
} = require('../middleware/validateStudent');

const router = express.Router();

// Collection routes
router.get('/', getAllStudents);
router.post('/', validateCreateStudent, createStudent);

// Item routes
router.get('/:id', getStudentById);
router.put('/:id', validateUpdateStudent, updateStudent);
router.delete('/:id', deleteStudent);

module.exports = router;
