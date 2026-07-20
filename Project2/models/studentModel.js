/**
 * models/studentModel.js
 * ---------------------------------------------
 * In-memory "database" for students.
 * Exposes a small persistence-style API so the
 * controller does not need to know we are using
 * an array under the hood.
 * ---------------------------------------------
 */

const { v4: uuidv4 } = require('uuid');

// In-memory data store
let students = [];

/* ---------- CRUD Helpers ---------- */

/**
 * Return all students (unfiltered).
 */
const getAll = () => students;

/**
 * Find a student by their id.
 * @param {string} id
 * @returns {object|undefined}
 */
const findById = (id) => students.find((s) => s.id === id);

/**
 * Check whether an email is already taken (case-insensitive),
 * optionally ignoring a specific id (useful during updates).
 * @param {string} email
 * @param {string} [ignoreId]
 */
const emailExists = (email, ignoreId = null) => {
  const normalized = String(email).trim().toLowerCase();
  return students.some(
    (s) => s.email.toLowerCase() === normalized && s.id !== ignoreId
  );
};

/**
 * Create a new student record.
 * @param {{name:string,email:string,age:number,course:string}} data
 */
const create = (data) => {
  const now = new Date().toISOString();
  const student = {
    id: uuidv4(),
    name: data.name.trim(),
    email: data.email.trim().toLowerCase(),
    age: Number(data.age),
    course: data.course.trim(),
    createdAt: now,
    updatedAt: now,
  };
  students.push(student);
  return student;
};

/**
 * Update an existing student by id.
 * @param {string} id
 * @param {object} data - fields to update
 * @returns {object|null} the updated student, or null if not found
 */
const update = (id, data) => {
  const idx = students.findIndex((s) => s.id === id);
  if (idx === -1) return null;

  const existing = students[idx];
  const updated = {
    ...existing,
    ...(data.name !== undefined && { name: String(data.name).trim() }),
    ...(data.email !== undefined && { email: String(data.email).trim().toLowerCase() }),
    ...(data.age !== undefined && { age: Number(data.age) }),
    ...(data.course !== undefined && { course: String(data.course).trim() }),
    updatedAt: new Date().toISOString(),
  };

  students[idx] = updated;
  return updated;
};

/**
 * Remove a student by id.
 * @param {string} id
 * @returns {object|null} the removed student, or null if not found
 */
const remove = (id) => {
  const idx = students.findIndex((s) => s.id === id);
  if (idx === -1) return null;
  const [removed] = students.splice(idx, 1);
  return removed;
};

/**
 * Reset the in-memory store (used in tests / seed).
 */
const reset = () => {
  students = [];
};

/* ---------- Optional Seed Data ---------- */

const seed = () => {
  if (students.length > 0) return;
  const samples = [
    { name: 'Aarav Sharma', email: 'aarav@example.com', age: 21, course: 'Computer Science' },
    { name: 'Isha Verma', email: 'isha@example.com', age: 23, course: 'Mathematics' },
    { name: 'Rohan Gupta', email: 'rohan@example.com', age: 19, course: 'Physics' },
  ];
  samples.forEach(create);
};

// Auto-seed for a friendlier first-run experience
seed();

module.exports = {
  getAll,
  findById,
  emailExists,
  create,
  update,
  remove,
  reset,
  seed,
};
