const { Schema, model } = require('mongoose');

const contactSchema = new Schema(
  {
    name: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    email: String,
    isFavourite: { type: Boolean, default: false },
    contactType: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = model('Contact', contactSchema);
