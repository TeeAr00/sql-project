const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth');

module.exports = (db2) => {
    router.post('/', authenticateToken, (req, res) => {
        const userId = req.user.id;
        const { test_set_name, score } = req.body;

        if (!userId || !test_set_name || typeof score !== 'number') {
            return res.status(400).json({ error: 'Tietoja puuttuu' });
        }

        const sql = `
            INSERT INTO sqlharjoitus2.test_results (user_id, test_set_name, score)
            VALUES (?, ?, ?);
        `;

        db2.query(sql, [userId, test_set_name, score], (err, result) => {
            if (err) {
            console.error('Virhe tallennettaessa tulosta:', err);
            return res.status(500).json({ error: 'Tietokanta virhe' });
            }

            res.status(201).json({ message: 'Tulos tallennettu', id: result.insertId });
        });
    });



  
  router.get('/', authenticateToken, (req, res) => {
    const userId = req.user.id;

    const query = `
      SELECT id, test_set_name, score, scored_at
      FROM sqlharjoitus2.test_results
      WHERE user_id = ?
      ORDER BY scored_at DESC
    `;

    db2.query(query, [userId], (err, results) => {
      if (err) {
        console.error('Virhe tietoja haettaessa:', err);
        return res.status(500).json({ error: 'Tietokanta virhe' });
      }
      res.json(results);
    });
  });

  return router;
};
