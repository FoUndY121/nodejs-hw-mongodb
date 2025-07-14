const createHttpError = require('http-errors');

const validateBody = (schema) => {
  return (req, res, next) => {
    console.log('Validating body:', req.body);
    const { error } = schema.validate(req.body);
    if (error) {
      return next(createHttpError(400, error.details[0].message));
    }
    next();
  };
};

module.exports = validateBody;
