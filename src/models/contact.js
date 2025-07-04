const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Contact must have a name'],
    },
    email: {
      type: String,
      required: [true, 'Contact must have an email'],
    },
    phone: {
      type: String,
      required: [true, 'Contact must have a phone number'],
    },
  },
  { timestamps: true }
);

const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;
