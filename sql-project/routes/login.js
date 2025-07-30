const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = (db2) => {
  const router = express.Router();

  router.post('/', async (req, res) => {
    const { username, password } = req.body;

    try {
      const [rows] = await db2.promise().query('SELECT * FROM users WHERE username = ?', [username]);
      if (rows.length === 0) {
        return res.status(400).json({ message: 'Virheelliset käyttäjätiedot' });
      }

      const user = rows[0];
      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        return res.status(400).json({ message: 'Virheelliset käyttäjätiedot' });
      }

      const token = jwt.sign({ id: user.user_id, username: user.username, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

      res.json({ token });
    } catch (error) {
      console.error('Kirjautumis virhe:', error);
      res.status(500).json({ message: 'Serveri virhe' });
    }
  });

  return router;
};
