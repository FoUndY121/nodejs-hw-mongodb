const createHttpError = require('http-errors');

const validateBody = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) {
    return next(createHttpError(400, error.message));
  }
  next();
};

module.exports = validateBody;
