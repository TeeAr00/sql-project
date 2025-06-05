const express = require('express');
const router = express.Router();

//nopea fiksaus, jotta kentillä ei voi muokata tietokantaa, parempi toteutus myöhemmin
function isSelectQuery(query) {
  if (!query) return false;
  const trimmed = query.trim().toUpperCase();
  return trimmed.startsWith('SELECT');
}

module.exports = (db) => {
  // haetaan kaikki tehtävät joista palautetaan id ja kuvaus
  router.get('/', async (req, res) => {
    try {
      const [rows] = await db.promise().query('SELECT id, description, class FROM exercises');
      res.json(rows);
    } catch (err) {
      console.error('Error fetching exercises:', err);
      res.status(500).json({ error: 'Database error' });
    }
  });

  // Haetaan yksittäisen tehtävän tiedot 
  router.get('/:id', async (req, res) => {
    const exerciseId = req.params.id;
    try {
      const [rows] = await db.promise().query('SELECT * FROM exercises WHERE id = ?', [exerciseId]);
      if (rows.length === 0) {
        return res.status(404).json({ error: 'Exercise not found' });
      }
      res.json(rows[0]);
    } catch (err) {
      console.error('Error fetching exercise:', err);
      res.status(500).json({ error: 'Database error' });
    }
  });

  // käyttäjän kirjoittama kysely ja tarkasta että se on SELECT
  router.post('/:id/evaluate', async (req, res) => {
    const exerciseId = req.params.id;
    const userQuery = req.body.query;


    if (!userQuery) {
      return res.status(400).json({ error: 'User query missing' });
    }
    if (!isSelectQuery(userQuery)) {
      return res.status(400).json({ error: 'Only SELECT queries are allowed' });
    }

    try {
      // Hae odotettu kysely
      const [exerciseRows] = await db.promise().query('SELECT expected_query, class FROM exercises WHERE id = ?', [exerciseId]);
      if (exerciseRows.length === 0) {
        return res.status(404).json({ error: 'Exercise not found' });
      }
      const expectedQuery = exerciseRows[0].expected_query;

      if (!isSelectQuery(expectedQuery)) {
        return res.status(500).json({ error: 'Expected query must be a SELECT query' });
      }

      // Suorita molemmat kyselyt ja vertaa
      const [correctRows] = await db.promise().query(expectedQuery);
      const [userRows] = await db.promise().query(userQuery);

      const isCorrect = JSON.stringify(userRows.sort()) === JSON.stringify(correctRows.sort());

      res.json({
        correct: isCorrect,
        expected: correctRows,
        actual: userRows
      });
    } catch (err) {
      console.error('Error evaluating queries:', err);
      res.status(500).json({ error: 'Database error or invalid query' });
    }
  });

  return router;
};
