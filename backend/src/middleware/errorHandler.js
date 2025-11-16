// ============================================
// Error Handling Middleware
// ============================================

// Custom error class
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Not found handler
function notFound(req, res, next) {
  const error = new AppError(`Not Found - ${req.originalUrl}`, 404);
  next(error);
}

// Global error handler
function errorHandler(err, req, res, next) {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Handle specific error types
  if (err.code === 'SQLITE_CONSTRAINT') {
    statusCode = 409;
    if (err.message.includes('UNIQUE')) {
      message = 'Data sudah ada dalam database';
    } else {
      message = 'Constraint violation';
    }
  }

  // Handle validation errors
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = err.details ? err.details.map(d => d.message).join(', ') : err.message;
  }

  // Log error in development
  if (process.env.NODE_ENV === 'development') {
    console.error('❌ Error:', {
      message: err.message,
      stack: err.stack,
      statusCode
    });
  }

  // Send error response
  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
}

// Async handler wrapper
function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

module.exports = {
  AppError,
  notFound,
  errorHandler,
  asyncHandler
};