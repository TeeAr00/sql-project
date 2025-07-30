const express = require('express');
const bcrypt = require('bcrypt');

module.exports = (db2) => {
  const router = express.Router();
  //console.log('register kutsu lähti');
  router.post('/', async (req, res) => {
    const { username, email, password } = req.body;
    //tyhjät kentät pois
    if (!username || !email || !password || username.trim() === '' || email.trim() === '' || password.trim() === '') {
      return res.status(400).json({ message: 'Täytä kaikki kentät' });
    }

    try {
      const [rows] = await db2.promise().query('SELECT * FROM users WHERE username = ?', [username]);
      if (rows.length > 0) {
        return res.status(400).json({ message: 'Käyttäjä on jo käytössä' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      await db2
        .promise()
        .query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, hashedPassword]);

      res.status(201).json({ message: 'Käyttäjä rekisteröity' });
    } catch (error) {
      console.error('Virhe rekisteröityessä:', error);
      res.status(500).json({ message: 'Serveri virhe' });
    }
  });

  return router;
};
