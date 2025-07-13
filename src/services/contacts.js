const Contact = require('../models/contact');

const getAllContacts = async ({ page, perPage, sortBy, sortOrder, userId }) => {
  const skip = (page - 1) * perPage;
  const sortDirection = sortOrder === 'desc' ? -1 : 1;

  const totalItems = await Contact.countDocuments({ userId }); // Фільтр за userId
  const contacts = await Contact.find({ userId }) // Фільтр за userId
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

const getContactById = async (id, userId) => {
  return Contact.findOne({ _id: id, userId }); // Фільтр за userId
};

const addContact = async (data) => {
  return Contact.create(data);
};

const updateContactById = async (id, data, userId) => {
  return Contact.findOneAndUpdate({ _id: id, userId }, data, { new: true }); // Фільтр за userId
};

const deleteContactById = async (id, userId) => {
  return Contact.findOneAndDelete({ _id: id, userId }); // Фільтр за userId
};

module.exports = {
  getAllContacts,
  getContactById,
  addContact,
  updateContactById,
  deleteContactById,
};
