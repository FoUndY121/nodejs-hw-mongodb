const Contact = require('../models/contact');

const getAllContacts = async () => Contact.find();

const getContactById = async (id) => Contact.findById(id);

const addContact = async (data) => Contact.create(data);

const updateContactById = async (id, data) =>
  Contact.findByIdAndUpdate(id, data, { new: true });

const deleteContactById = async (id) => Contact.findByIdAndDelete(id);

module.exports = {
  getAllContacts,
  getContactById,
  addContact,
  updateContactById,
  deleteContactById,
};
