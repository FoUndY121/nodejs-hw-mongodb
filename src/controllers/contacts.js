const contactsService = require('../services/contacts');
const createError = require('http-errors');

const getAll = async (req, res) => {
  const contacts = await contactsService.getAllContacts();
  res.json({ status: 200, message: 'OK', data: contacts });
};

const getById = async (req, res) => {
  const contact = await contactsService.getContactById(req.params.contactId);
  if (!contact) throw createError(404, 'Contact not found');
  res.json({ status: 200, data: contact });
};

const createContact = async (req, res) => {
  const newContact = await contactsService.addContact(req.body);
  res.status(201).json({ status: 201, message: 'Created', data: newContact });
};

const updateContact = async (req, res) => {
  const updated = await contactsService.updateContactById(
    req.params.contactId,
    req.body
  );
  if (!updated) throw createError(404, 'Contact not found');
  res.json({ status: 200, message: 'Updated', data: updated });
};

const deleteContact = async (req, res) => {
  const deleted = await contactsService.deleteContactById(req.params.contactId);
  if (!deleted) throw createError(404, 'Contact not found');
  res.status(204).send();
};

module.exports = {
  getAll,
  getById,
  createContact,
  updateContact,
  deleteContact,
};
