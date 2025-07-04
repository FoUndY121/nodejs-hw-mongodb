const Contact = require('../models/contact');

// GET /api/contacts
const getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.status(200).json({
      status: 200,
      message: 'Успешно найдены контакты!',
      data: contacts,
    });
  } catch (error) {
    res.status(500).json({ message: 'Не удалось получить контакты' });
  }
};

// GET /api/contacts/:id
const getContactById = async (req, res) => {
  try {
    const { id } = req.params;
    const contact = await Contact.findById(id);

    if (!contact) {
      return res.status(404).json({ message: 'Контакт не найден' });
    }

    res.status(200).json({
      status: 200,
      message: `Успешно найден контакт с id ${id}!`,
      data: contact,
    });
  } catch (error) {
    res.status(500).json({ message: 'Не удалось получить контакт по ID' });
  }
};

module.exports = {
  getAllContacts,
  getContactById,
};
