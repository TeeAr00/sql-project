const express = require('express');
const bcrypt = require('bcrypt');

module.exports = (db2) => {
  const router = express.Router();
  console.log('register kutsu lähti');
  router.post('/', async (req, res) => {
    const { username, email, password } = req.body;

    try {
      const [rows] = await db2.promise().query('SELECT * FROM users WHERE username = ?', [username]);
      if (rows.length > 0) {
        return res.status(400).json({ message: 'Username already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      await db2
        .promise()
        .query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, hashedPassword]);

      res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  return router;
};
