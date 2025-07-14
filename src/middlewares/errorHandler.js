const { HttpError } = require('http-errors');

const errorHandler = (err, req, res, next) => {
  console.error('❌ Error caught by errorHandler:', err);

  if (err instanceof HttpError) {
    res.status(err.status).json({
      status: err.status,
      message: err.message,
      data: null,
    });
    return;
  }

  res.status(500).json({
    status: 500,
    message: 'Internal Server Error',
    data: err.message,
  });
};

module.exports = errorHandler;
