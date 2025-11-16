// ============================================
// Standard Response Utilities
// ============================================

class ResponseHandler {
  // Success response
  static success(res, data, message = 'Success', statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
      timestamp: new Date().toISOString()
    });
  }

  // Created response
  static created(res, data, message = 'Resource created successfully') {
    return this.success(res, data, message, 201);
  }

  // Error response
  static error(res, message = 'Error occurred', statusCode = 500, errors = null) {
    const response = {
      success: false,
      error: message,
      timestamp: new Date().toISOString()
    };

    if (errors) {
      response.errors = errors;
    }

    return res.status(statusCode).json(response);
  }

  // Bad request response
  static badRequest(res, message = 'Bad request', errors = null) {
    return this.error(res, message, 400, errors);
  }

  // Unauthorized response
  static unauthorized(res, message = 'Unauthorized') {
    return this.error(res, message, 401);
  }

  // Forbidden response
  static forbidden(res, message = 'Forbidden') {
    return this.error(res, message, 403);
  }

  // Not found response
  static notFound(res, message = 'Resource not found') {
    return this.error(res, message, 404);
  }

  // Conflict response
  static conflict(res, message = 'Resource already exists') {
    return this.error(res, message, 409);
  }

  // Pagination response
  static paginated(res, data, pagination, message = 'Success') {
    return res.status(200).json({
      success: true,
      message,
      data,
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total: pagination.total,
        totalPages: Math.ceil(pagination.total / pagination.limit)
      },
      timestamp: new Date().toISOString()
    });
  }
}

module.exports = ResponseHandler;