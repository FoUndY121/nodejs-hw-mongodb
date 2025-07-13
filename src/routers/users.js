const express = require('express');
const router = express.Router();

// Пример базового роутинга
router.get('/', (req, res) => {
  res.json({ message: 'Users route is working' });
});

module.exports = router;
