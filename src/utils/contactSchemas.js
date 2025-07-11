const Joi = require('joi');

const contactAddSchema = Joi.object({
  name: Joi.string().min(3).max(20).required(),
  email: Joi.string().email().required(),
  phoneNumber: Joi.string().min(3).max(20).required(),
  contactType: Joi.string().min(3).max(20).required(),
  isFavourite: Joi.boolean(), // не обов'язково, але можна передавати
});

const contactUpdateSchema = Joi.object({
  name: Joi.string().min(3).max(20),
  email: Joi.string().email(),
  phoneNumber: Joi.string().min(3).max(20),
  contactType: Joi.string().min(3).max(20),
  isFavourite: Joi.boolean(),
}).min(1);

module.exports = {
  contactAddSchema,
  contactUpdateSchema,
};
