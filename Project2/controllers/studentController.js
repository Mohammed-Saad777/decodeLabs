/**
 * controllers/studentController.js
 * ---------------------------------------------
 * Business logic for the /students resource.
 *
 * Bonus features included:
 *   - Search by name          (?search=term)
 *   - Filter by course        (?course=Math)
 *   - Pagination              (?page=1&limit=10)
 *   - Sorting                 (?sortBy=name&order=asc)
 * ---------------------------------------------
 */

const Student = require('../models/studentModel');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

/* ---------- Helpers ---------- */

const parseIntSafe = (val, def) => {
  const n = parseInt(val, 10);
  return Number.isFinite(n) && n > 0 ? n : def;
};

/**
 * GET /api/students
 * Query params:
 *   search  - case-insensitive substring match on name
 *   course  - case-insensitive exact match on course
 *   sortBy  - "name" | "age" | "createdAt"
 *   order   - "asc" | "desc" (default asc)
 *   page    - integer >= 1  (default 1)
 *   limit   - integer >= 1  (default 10, max 100)
 */
const getAllStudents = asyncHandler(async (req, res) => {
  let list = Student.getAll();

  const { search, course, sortBy, order, page, limit } = req.query;

  // --- Filter: search by name ---
  if (search && String(search).trim() !== '') {
    const q = String(search).trim().toLowerCase();
    list = list.filter((s) => s.name.toLowerCase().includes(q));
  }

  // --- Filter: by course ---
  if (course && String(course).trim() !== '') {
    const c = String(course).trim().toLowerCase();
    list = list.filter((s) => s.course.toLowerCase() === c);
  }

  // --- Sort ---
  const sortableFields = ['name', 'age', 'createdAt'];
  if (sortBy && sortableFields.includes(sortBy)) {
    const direction = order === 'desc' ? -1 : 1;
    list = [...list].sort((a, b) => {
      if (a[sortBy] < b[sortBy]) return -1 * direction;
      if (a[sortBy] > b[sortBy]) return 1 * direction;
      return 0;
    });
  }

  // --- Pagination ---
  const total = list.length;
  const pageNum = parseIntSafe(page, 1);
  const limitNum = Math.min(parseIntSafe(limit, 10), 100);
  const startIdx = (pageNum - 1) * limitNum;
  const paginated = list.slice(startIdx, startIdx + limitNum);

  res.status(200).json({
    success: true,
    status: 200,
    message: 'Students retrieved successfully',
    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.max(1, Math.ceil(total / limitNum)),
    },
    count: paginated.length,
    data: paginated,
  });
});

/**
 * GET /api/students/:id
 */
const getStudentById = asyncHandler(async (req, res, next) => {
  const student = Student.findById(req.params.id);
  if (!student) {
    return next(new ApiError(404, `Student with id "${req.params.id}" not found`));
  }
  res.status(200).json({
    success: true,
    status: 200,
    message: 'Student retrieved successfully',
    data: student,
  });
});

/**
 * POST /api/students
 * Body: { name, email, age, course }
 */
const createStudent = asyncHandler(async (req, res, next) => {
  const { name, email, age, course } = req.body;

  if (Student.emailExists(email)) {
    return next(new ApiError(400, 'A student with this email already exists'));
  }

  const student = Student.create({ name, email, age, course });

  res.status(201).json({
    success: true,
    status: 201,
    message: 'Student created successfully',
    data: student,
  });
});

/**
 * PUT /api/students/:id
 * Body: partial or full { name, email, age, course }
 */
const updateStudent = asyncHandler(async (req, res, next) => {
  const existing = Student.findById(req.params.id);
  if (!existing) {
    return next(new ApiError(404, `Student with id "${req.params.id}" not found`));
  }

  if (req.body.email && Student.emailExists(req.body.email, req.params.id)) {
    return next(new ApiError(400, 'A student with this email already exists'));
  }

  const updated = Student.update(req.params.id, req.body);

  res.status(200).json({
    success: true,
    status: 200,
    message: 'Student updated successfully',
    data: updated,
  });
});

/**
 * DELETE /api/students/:id
 */
const deleteStudent = asyncHandler(async (req, res, next) => {
  const removed = Student.remove(req.params.id);
  if (!removed) {
    return next(new ApiError(404, `Student with id "${req.params.id}" not found`));
  }

  res.status(200).json({
    success: true,
    status: 200,
    message: 'Student deleted successfully',
    data: removed,
  });
});

module.exports = {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
};
