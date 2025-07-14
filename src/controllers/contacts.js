const Contact = require('../models/Contact');
const cloudinary = require('cloudinary').v2;
const createHttpError = require('http-errors');

const createContact = async (req, res, next) => {
  const { name, phoneNumber, email, contactType, isFavourite } = req.body;
  let photoUrl = null;
  if (req.file) {
    const result = await cloudinary.uploader.upload(req.file.path);
    photoUrl = result.secure_url;
  }
  const contact = await Contact.create({
    name,
    phoneNumber,
    email,
    contactType,
    isFavourite,
    photo: photoUrl,
    userId: req.user._id,
  });
  res.status(201).json({ status: 201, message: 'Created', data: contact });
};

const updateContact = async (req, res, next) => {
  const { contactId } = req.params;
  const { name, phoneNumber, email, contactType, isFavourite } = req.body;
  let photoUrl = null;
  if (req.file) {
    const result = await cloudinary.uploader.upload(req.file.path);
    photoUrl = result.secure_url;
  }
  const contact = await Contact.findByIdAndUpdate(
    contactId,
    {
      name,
      phoneNumber,
      email,
      contactType,
      isFavourite,
      photo: photoUrl,
      userId: req.user._id,
    },
    { new: true, runValidators: true }
  );
  if (!contact) throw createHttpError(404, 'Contact not found');
  res.status(200).json({ status: 200, message: 'Updated', data: contact });
};

const getContacts = async (req, res, next) => {
  const contacts = await Contact.find({ userId: req.user._id });
  res
    .status(200)
    .json({
      status: 200,
      message: 'Successfully found contacts!',
      data: contacts,
    });
};

const getContactById = async (req, res, next) => {
  const contact = await Contact.findOne({
    _id: req.params.contactId,
    userId: req.user._id,
  });
  if (!contact) throw createHttpError(404, 'Contact not found');
  res
    .status(200)
    .json({
      status: 200,
      message: 'Successfully found contact!',
      data: contact,
    });
};

const deleteContact = async (req, res, next) => {
  const contact = await Contact.findOneAndDelete({
    _id: req.params.contactId,
    userId: req.user._id,
  });
  if (!contact) throw createHttpError(404, 'Contact not found');
  res.status(204).send();
};

module.exports = {
  createContact,
  updateContact,
  getContacts,
  getContactById,
  deleteContact,
};
