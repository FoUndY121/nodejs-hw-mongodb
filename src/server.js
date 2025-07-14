const express = require('express');
require('dotenv').config();
const { initMongoConnection } = require('./db/initMongoConnection');
const contactsRouter = require('./routers/contacts');
const authRouter = require('./routers/auth');
const notFoundHandler = require('./middlewares/notFoundHandler');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  console.log(` ${req.method} ${req.originalUrl}`);
  console.log(' Body:', req.body);
  next();
});

app.use('/auth', authRouter);
app.use('/contacts', contactsRouter);

app.use(notFoundHandler);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

const setupServer = async () => {
  try {
    await initMongoConnection();
    app.listen(PORT, () => {
      console.log(` Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error(' Server failed to start:', error.message);
    process.exit(1);
  }
};

module.exports = setupServer;
