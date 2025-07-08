const contactsService = require('../services/contacts');
const createError = require('http-errors');

const getAll = async (req, res, next) => {
  try {
    const contacts = await contactsService.getAllContacts();
    res.json({ status: 200, message: 'OK', data: contacts });
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const contact = await contactsService.getContactById(req.params.contactId);
    if (!contact) throw createError(404, 'Contact not found');
    res.json({ status: 200, data: contact });
  } catch (error) {
    next(error);
  }
};

const createContact = async (req, res, next) => {
  try {
    const newContact = await contactsService.addContact(req.body);
    res.status(201).json({ status: 201, message: 'Created', data: newContact });
  } catch (error) {
    next(error);
  }
};

const updateContact = async (req, res, next) => {
  try {
    const updated = await contactsService.updateContactById(
      req.params.contactId,
      req.body
    );
    if (!updated) throw createError(404, 'Contact not found');
    res.json({ status: 200, message: 'Updated', data: updated });
  } catch (error) {
    next(error);
  }
};

const deleteContact = async (req, res, next) => {
  try {
    const deleted = await contactsService.deleteContactById(
      req.params.contactId
    );
    if (!deleted) throw createError(404, 'Contact not found');
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAll,
  getById,
  createContact,
  updateContact,
  deleteContact,
};
