/**
 * app.js
 * ---------------------------------------------
 * Express application setup:
 * - Global middlewares (CORS, JSON parser, logger)
 * - Route mounting
 * - 404 + global error handlers
 * ---------------------------------------------
 */

const express = require('express');
const cors = require('cors');

const requestLogger = require('./middleware/logger');
const notFoundHandler = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');

const studentRoutes = require('./routes/studentRoutes');

const app = express();

/* ---------- Global Middleware ---------- */

// CORS configuration - reads allowed origins from env
const corsOrigin = process.env.CORS_ORIGIN || '*';
app.use(
  cors({
    origin: corsOrigin === '*' ? '*' : corsOrigin.split(',').map((o) => o.trim()),
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// JSON body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Custom request logger (method, URL, status, duration)
app.use(requestLogger);

/* ---------- Routes ---------- */

// Health-check endpoint (helpful for uptime monitoring)
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to the Student Management REST API',
    version: '1.0.0',
    docs: '/api/students',
  });
});

app.get('/health', (req, res) => {
  res.status(200).json({ success: true, status: 'OK', uptime: process.uptime() });
});

// Feature routes
app.use('/api/students', studentRoutes);

/* ---------- Error Handling ---------- */

// 404 - route not found
app.use(notFoundHandler);

// Global error handler (must be last)
app.use(errorHandler);

module.exports = app;
