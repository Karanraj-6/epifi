export class ApiError extends Error {
  constructor(status, message, details) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

export function notFound(message = 'Resource not found') {
  return new ApiError(404, message);
}

export function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    next(err);
    return;
  }

  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    res.status(400).json({ message: 'Invalid JSON body' });
    return;
  }

  if (err.name === 'ZodError') {
    res.status(400).json({
      message: 'Validation failed',
      errors: err.errors.map((item) => ({
        path: item.path.join('.'),
        message: item.message
      }))
    });
    return;
  }

  if (err instanceof ApiError) {
    const body = { message: err.message };
    if (err.details) body.details = err.details;
    res.status(err.status).json(body);
    return;
  }

  console.error(err);
  res.status(500).json({ message: 'Internal server error' });
}
