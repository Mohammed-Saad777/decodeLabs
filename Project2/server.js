/**
 * server.js
 * ---------------------------------------------
 * Application entry point.
 * - Loads environment variables via dotenv
 * - Boots the Express app defined in app.js
 * - Handles graceful shutdown & uncaught errors
 * ---------------------------------------------
 */

require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 5000;

// Start the HTTP server
const server = app.listen(PORT, () => {
  console.log(
    `Student Management API is running on port ${PORT} (env: ${process.env.NODE_ENV || 'development'})`
  );
});

// Graceful shutdown on SIGTERM / SIGINT
const shutdown = (signal) => {
  console.log(`\n${signal} received. Closing server gracefully...`);
  server.close(() => {
    console.log('Server closed. Bye!');
    process.exit(0);
  });
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

// Safety nets for unexpected errors
process.on('unhandledRejection', (reason) => {
  console.error('UNHANDLED REJECTION:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION:', err);
  process.exit(1);
});
