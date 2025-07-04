const express = require('express');
const cors = require('cors');
const pino = require('pino-http')();
const contactsRouter = require('./routes/contacts');

const app = express();

app.use(cors());
app.use(pino); // Заменяет morgan
app.use(express.json());

app.use('/api/contacts', contactsRouter);

app.use((req, res) => {
  res.status(404).json({ message: 'Not Found' });
});

module.exports = app;
