const Joi = require('joi');

const contactAddSchema = Joi.object({
  name: Joi.string().min(3).max(20).required(),
  email: Joi.string().email().required(),
  phoneNumber: Joi.string().min(3).max(20).required(),
  contactType: Joi.string()
    .valid('work', 'home', 'personal')
    .min(3)
    .max(20)
    .required(), // Додано valid
  isFavourite: Joi.boolean().optional(), // Змінено на optional для чіткості
});

const contactUpdateSchema = Joi.object({
  name: Joi.string().min(3).max(20),
  email: Joi.string().email(),
  phoneNumber: Joi.string().min(3).max(20),
  contactType: Joi.string().valid('work', 'home', 'personal').min(3).max(20),
  isFavourite: Joi.boolean(),
}).min(1);

module.exports = {
  contactAddSchema,
  contactUpdateSchema,
};
