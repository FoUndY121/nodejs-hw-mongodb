const createHttpError = require('http-errors');

const notFoundHandler = (req, res, next) => {
  next(createHttpError(404, 'Route not found'));
};

module.exports = notFoundHandler;
