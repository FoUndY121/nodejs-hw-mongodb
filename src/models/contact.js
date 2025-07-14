const { Schema, model } = require('mongoose');

const contactSchema = new Schema(
  {
    name: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    email: String,
    isFavourite: { type: Boolean, default: false },
    contactType: { type: String, required: true },
    photo: String,
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

contactSchema.set('toJSON', {
  transform: (doc, ret) => {
    return ret;
  },
});

module.exports = model('Contact', contactSchema);
