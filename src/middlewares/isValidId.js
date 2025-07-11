const { isValidObjectId } = require('mongoose');

const isValidId = (req, res, next) => {
  const { contactId } = req.params;
  if (!isValidObjectId(contactId)) {
    return res.status(400).json({ status: 400, message: 'Invalid ID format' });
  }
  next();
};

module.exports = isValidId;
