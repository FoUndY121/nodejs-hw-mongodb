const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const createHttpError = require('http-errors');
const User = require('../models/users');
const Session = require('../models/Session');

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

const register = async ({ name, email, password }) => {
  console.log(
    'Register attempt - Name:',
    name,
    'Email:',
    email,
    'Password:',
    password
  );
  const existing = await User.findOne({ email });
  console.log('Existing user:', existing);
  if (existing) {
    throw createHttpError(409, 'Email in use');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  console.log('Hashed password generated');
  const user = await User.create({ name, email, password: hashedPassword });
  console.log('User created:', user);
  return user;
};

const login = async ({ email, password }) => {
  console.log('Login attempt - Email:', email, 'Password:', password);
  const user = await User.findOne({ email });
  console.log('Found user:', user);
  if (!user) {
    throw createHttpError(401, 'Email not found');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  console.log('Password match:', isMatch);
  if (!isMatch) {
    throw createHttpError(401, 'Incorrect password');
  }

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
  } catch (error) {
    console.error('Session creation error:', error.message);
    throw createHttpError(500, 'Failed to create session');
  }

  return { user, accessToken, refreshToken };
};

const refresh = async (refreshToken) => {
  console.log('Refresh attempt - Refresh Token:', refreshToken);
  let payload;
  try {
    payload = jwt.verify(refreshToken, process.env.JWT_SECRET);
    console.log('Verified payload:', payload);
  } catch (error) {
    console.error('Refresh token verification error:', error.message);
    throw createHttpError(401, 'Invalid refresh token');
  }

  const session = await Session.findOne({ refreshToken });
  console.log('Found session:', session);
  if (!session || session.refreshTokenValidUntil < new Date()) {
    throw createHttpError(401, 'Refresh token expired');
  }

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
  } catch (error) {
    console.error('Session creation error during refresh:', error.message);
    throw createHttpError(500, 'Failed to create session');
  }

  return { accessToken, newRefreshToken };
};

const logout = async (refreshToken) => {
  console.log('Logout attempt - Refresh Token:', refreshToken);
  const result = await Session.deleteOne({ refreshToken });
  console.log('Logout result:', result);
  if (result.deletedCount === 0) {
    throw createHttpError(404, 'Session not found');
  }
};

module.exports = {
  register,
  login,
  refresh,
  logout,
};
