const express = require('express');
const router = express.Router();
const contactsController = require('../controllers/contacts');
const ctrlWrapper = require('../utils/ctrlWrapper');

const validateBody = require('../utils/validateBody');
const isValidId = require('../middlewares/isValidId');
const {
  contactAddSchema,
  contactUpdateSchema,
} = require('../utils/contactSchemas');

router.get('/', ctrlWrapper(contactsController.getAll));

router.get('/:contactId', isValidId, ctrlWrapper(contactsController.getById));

router.post(
  '/',
  validateBody(contactAddSchema),
  ctrlWrapper(contactsController.createContact)
);

router.patch(
  '/:contactId',
  isValidId,
  validateBody(contactUpdateSchema),
  ctrlWrapper(contactsController.updateContact)
);

router.delete(
  '/:contactId',
  isValidId,
  ctrlWrapper(contactsController.deleteContact)
);

module.exports = router;
