const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');

//Vain SELECT kyselyitä
function isSelectQuery(query) {
  if (!query) return false;
  const trimmed = query.trim().toUpperCase();
  return trimmed.startsWith('SELECT');
}

//sanojen yhdistys kyselyksi
function tokensToQuery(tokens) {
  if (!Array.isArray(tokens) || tokens.length === 0) return '';
  
  let query = tokens.join(' ').replace(/\s*;\s*$/, ';');
  
  return query.trim();
}

// sanojen sekoitus
function shuffle(array) {
  return array
    .map(a => ({ sort: Math.random(), value: a }))
    .sort((a, b) => a.sort - b.sort)
    .map(a => a.value);
}

module.exports = (db) => {

  //Kaikki kysymykset
  router.get('/', async (req, res) => {
    try {
      const [rows] = await db.promise().query('SELECT id, description, class FROM exercises2');
      res.json(rows);
    } catch (err) {
      console.error('Virhe haettaessa tehtäviä:', err);
      res.status(500).json({ error: 'Tietokanta virhe get' });
    }
  });

  // Tietyn kysymyksen haku idllä
  router.get('/:id', async (req, res) => {
    const id = req.params.id;
    try {
      const [rows] = await db.promise().query('SELECT * FROM exercises2 WHERE id = ?', [id]);
      if (!rows.length) return res.status(404).json({ error: 'TEhtävää ei löytynyt' });

      let wordBank;
      try {
        wordBank = JSON.parse(rows[0].word_bank);
      } catch {
        wordBank = rows[0].word_bank.split(' ');
      }

      res.json({
        id: rows[0].id,
        description: rows[0].description,
        hint: rows[0].hint,
        class: rows[0].class,
        word_bank: shuffle(wordBank)
      });
    } catch (err) {
      console.error('Virhe hauettaessa tehtävää:', err);
      res.status(500).json({ error: 'Tietokanta virhe' });
    }
  });

  router.post('/:id/evaluate', async (req, res) => {
    const exerciseId = req.params.id;
    const tokens = req.body.user_tokens;

    if (!tokens || !Array.isArray(tokens)) {
      return res.status(400).json({ error: 'Virhe' });
    }

    const userQuery = tokensToQuery(tokens);

    if (!isSelectQuery(userQuery)) {
      return res.status(400).json({ error: 'Vain SELECT sallittu' });
    }

    try {
      // Haetaan odotettu tulos ja verrataan keskenään käyttäjän kyselyn kanssa
      const [exerciseRows] = await db.promise().query(
        'SELECT expected_query FROM exercises2 WHERE id = ?',
        [exerciseId]
      );

      if (exerciseRows.length === 0) {
        return res.status(404).json({ error: 'Tehtävää ei löytynyt' });
      }

      const expectedQuery = exerciseRows[0].expected_query;

      const [correctRows] = await db.promise().query(expectedQuery);
      const [userRows] = await db.promise().query(userQuery);

      const isCorrect = JSON.stringify(userRows.sort()) === JSON.stringify(correctRows.sort());

      res.json({
        correct: isCorrect,
        expected: correctRows,
        actual: userRows
      });

    } catch (err) {
      console.error('Virhe vertailussa:', err);
      res.status(500).json({ error: 'Tietokanta virhe' });
    }
  });

  return router;
};