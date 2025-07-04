const express = require('express');
const router = express.Router();
const {
  getAllContacts,
  getContactById,
} = require('../controllers/contactsController');

router.get('/', getAllContacts);
router.get('/:id', getContactById);

module.exports = router;
