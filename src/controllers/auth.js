const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const createHttpError = require('http-errors');
const User = require('../models/users');
const Session = require('../models/Session');
const nodemailer = require('nodemailer');

const generateTokens = (userId) => {
  const accessToken = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '15m',
  });
  const refreshToken = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
  const now = new Date();
  const accessTokenValidUntil = new Date(now.getTime() + 15 * 60 * 1000);
  const refreshTokenValidUntil = new Date(
    now.getTime() + 30 * 24 * 60 * 60 * 1000
  );
  return {
    accessToken,
    refreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil,
  };
};

const register = async (req, res, next) => {
  const { name, email, password } = req.body;
  console.log(
    'Register attempt - Name:',
    name,
    'Email:',
    email,
    'Password:',
    password
  );
  if (!name || !email || !password) {
    return next(createHttpError(400, 'Missing required fields'));
  }
  const existing = await User.findOne({ email });
  console.log('Existing user:', existing);
  if (existing) return next(createHttpError(409, 'Email in use'));
  const hashedPassword = await bcrypt.hash(password, 10);
  console.log('Hashed password generated');
  const user = await User.create({ name, email, password: hashedPassword });
  console.log('User created:', user);
  res.status(201).json({
    status: 'success',
    message: 'Successfully registered a user!',
    data: { user },
  });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  console.log('Login attempt - Email:', email, 'Password:', password);
  const user = await User.findOne({ email });
  console.log('Found user:', user);
  if (!user) return next(createHttpError(401, 'Email not found'));
  const isMatch = await bcrypt.compare(password, user.password);
  console.log('Password match:', isMatch);
  if (!isMatch) return next(createHttpError(401, 'Incorrect password'));
  await Session.deleteMany({ userId: user._id });
  console.log('Old sessions deleted');
  const {
    accessToken,
    refreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil,
  } = generateTokens(user._id);
  try {
    await Session.create({
      userId: user._id,
      accessToken,
      refreshToken,
      accessTokenValidUntil,
      refreshTokenValidUntil,
    });
    console.log('New session created');
    res.status(200).json({
      status: 'success',
      message: 'Successfully logged in an user!',
      data: { user, accessToken, refreshToken },
    });
  } catch (error) {
    console.error('Session creation error:', error.message);
    return next(createHttpError(500, 'Failed to create session'));
  }
};

const refresh = async (req, res, next) => {
  const { refreshToken } = req.body;
  console.log('Refresh attempt - Refresh Token:', refreshToken);
  let payload;
  try {
    payload = jwt.verify(refreshToken, process.env.JWT_SECRET);
    console.log('Verified payload:', payload);
  } catch (error) {
    console.error('Refresh token verification error:', error.message);
    return next(createHttpError(401, 'Invalid refresh token'));
  }
  const session = await Session.findOne({ refreshToken });
  console.log('Found session:', session);
  if (!session || session.refreshTokenValidUntil < new Date())
    return next(createHttpError(401, 'Refresh token expired'));
  await Session.deleteOne({ _id: session._id });
  console.log('Old session deleted');
  const {
    accessToken,
    refreshToken: newRefreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil,
  } = generateTokens(payload.userId);
  try {
    await Session.create({
      userId: payload.userId,
      accessToken,
      refreshToken: newRefreshToken,
      accessTokenValidUntil,
      refreshTokenValidUntil,
    });
    console.log('New session created for refresh');
    res.status(200).json({
      status: 'success',
      message: 'Token refreshed!',
      data: { accessToken, newRefreshToken },
    });
  } catch (error) {
    console.error('Session creation error during refresh:', error.message);
    return next(createHttpError(500, 'Failed to create session'));
  }
};

const logout = async (req, res, next) => {
  const { refreshToken } = req.body;
  console.log('Logout attempt - Refresh Token:', refreshToken);
  const result = await Session.deleteOne({ refreshToken });
  console.log('Logout result:', result);
  if (result.deletedCount === 0)
    return next(createHttpError(404, 'Session not found'));
  res.status(204).send();
};

const sendResetEmail = async (req, res, next) => {
  const { email } = req.body;
  console.log('Send reset email attempt - Email:', email);
  const user = await User.findOne({ email });
  if (!user) return next(createHttpError(404, 'User not found!'));
  const resetToken = jwt.sign({ email }, process.env.JWT_SECRET, {
    expiresIn: '5m',
  });
  const resetLink = `${process.env.APP_DOMAIN}/reset-password?token=${resetToken}`;
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });
  const mailOptions = {
    from: process.env.SMTP_FROM,
    to: email,
    subject: 'Password Reset Request',
    text: `Click the link to reset your password: ${resetLink}`,
    html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`,
  };
  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
    res.status(200).json({
      status: 200,
      message: 'Reset password email has been successfully sent.',
      data: {},
    });
  } catch (error) {
    console.error('Failed to send email:', error.message);
    return next(
      createHttpError(500, 'Failed to send the email, please try again later.')
    );
  }
};

const resetPassword = async (req, res, next) => {
  const { token, password } = req.body;
  console.log('Reset password attempt - Token:', token, 'Password:', password);
  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Verified payload:', payload);
  } catch (error) {
    console.error('Token verification error:', error.message);
    return next(createHttpError(401, 'Token is expired or invalid.'));
  }
  const user = await User.findOne({ email: payload.email });
  if (!user) return next(createHttpError(404, 'User not found!'));
  const hashedPassword = await bcrypt.hash(password, 10);
  await User.updateOne({ email: payload.email }, { password: hashedPassword });
  await Session.deleteMany({ userId: user._id });
  console.log('Password reset and sessions cleared');
  res.status(200).json({
    status: 200,
    message: 'Password has been successfully reset.',
    data: {},
  });
};

module.exports = {
  register,
  login,
  refresh,
  logout,
  sendResetEmail,
  resetPassword,
};
