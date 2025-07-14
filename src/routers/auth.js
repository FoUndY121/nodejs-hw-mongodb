const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');
const validateBody = require('../utils/validateBody');
const Joi = require('joi');

const registerSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const sendResetEmailSchema = Joi.object({
  email: Joi.string().email().required(),
});

router.post('/register', validateBody(registerSchema), authController.register);
router.post('/login', validateBody(loginSchema), authController.login);

router.post(
  '/send-reset-email',
  validateBody(sendResetEmailSchema),
  authController.sendResetEmail
);

module.exports = router;
