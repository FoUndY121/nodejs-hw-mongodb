const Contact = require('../models/contact');

const getAllContacts = async ({ page, perPage, sortBy, sortOrder }) => {
  const skip = (page - 1) * perPage;
  const sortDirection = sortOrder === 'desc' ? -1 : 1;

  const totalItems = await Contact.countDocuments();
  const contacts = await Contact.find()
    .sort({ [sortBy]: sortDirection })
    .skip(skip)
    .limit(perPage);

  const totalPages = Math.ceil(totalItems / perPage);

  return {
    data: contacts,
    page,
    perPage,
    totalItems,
    totalPages,
    hasPreviousPage: page > 1,
    hasNextPage: page < totalPages,
  };
};

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
