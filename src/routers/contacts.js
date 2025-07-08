const express = require('express');
const router = express.Router();
const contactsController = require('../controllers/contacts');
const ctrlWrapper = require('../utils/ctrlWrapper');

router.get('/', ctrlWrapper(contactsController.getAll));
router.get('/:contactId', ctrlWrapper(contactsController.getById));
router.post('/', ctrlWrapper(contactsController.createContact));
router.patch('/:contactId', ctrlWrapper(contactsController.updateContact));
router.delete('/:contactId', ctrlWrapper(contactsController.deleteContact));

module.exports = router;
