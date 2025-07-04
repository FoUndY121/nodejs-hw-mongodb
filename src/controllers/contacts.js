const mongoose = require('mongoose');
const { getAllContacts, getContactById } = require('../services/contacts');

async function getContacts(req, res, next) {
  try {
    const contacts = await getAllContacts();
    res.status(200).json({
      status: 200,
      message: 'Successfully found contacts!',
      data: contacts,
    });
  } catch (error) {
    next(error);
  }
}

async function getContact(req, res, next) {
  try {
    const { contactId } = req.params;

    if (!mongoose.isValidObjectId(contactId)) {
      return res.status(400).json({
        status: 404,
        message: 'Contact not found',
      });
    }

    // const contact = await getContactById(contactId);
    // if (!contact) {
    //   return res.status(404).json({
    //     status: 404,
    //     message: 'Contact not found',
    //   });
    // }

    res.status(200).json({
      status: 200,
      message: `Successfully found contact with id ${contactId}!`,
      data: contact,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { getContacts, getContact };
