const express = require('express');
const cors = require('cors');
const pino = require('pino-http')();
const { getContacts, getContact } = require('./controllers/contacts');

function setupServer() {
  const app = express();

  app.use(cors());
  app.use(pino);

  app.get('/contacts', getContacts);
  app.get('/contacts/:contactId', getContact);
  app.use((error, req, res, next) => {
    const { status = 404, message = 'Something went wrong' } = error;
    res.status(status).json({
      status,
      message,
    });
  });
  app.use((req, res) => {
    res.status(404).json({ message: 'Not found' });
  });
  app.use((req, res) => {
    res.status(404).json({ message: 'Not found' });
  });

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });

  return app;
}

module.exports = { setupServer };
