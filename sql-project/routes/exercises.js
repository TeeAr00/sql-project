const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');

//nopea fiksaus, jotta kentillä ei voi muokata tietokantaa, parempi toteutus myöhemmin
function isSelectQuery(query) {
  if (!query) return false;
  const trimmed = query.trim().toUpperCase();
  return trimmed.startsWith('SELECT');
}

module.exports = (db) => {

  //staattiset siirretty ylös ennen synaamisia. Ilmeisesti ei hae tarkemipia hakuja, kun jo löydetty reitti.
  router.post('/test-sets',authenticateToken, isAdmin , async (req, res) => {
  const { name, exerciseIds } = req.body;
  if (!name || !Array.isArray(exerciseIds)) {
    return res.status(400).json({ error: 'Virheellinen' });
  }

  const conn = await db.promise().getConnection();
  try {
    await conn.beginTransaction();
    const [result] = await conn.query('INSERT INTO test_sets (name) VALUES (?)', [name]);
    const testSetId = result.insertId;

    const values = exerciseIds.map(id => [testSetId, id]);
    await conn.query('INSERT INTO test_set_exercises (test_set_id, exercise_id) VALUES ?', [values]);

    await conn.commit();
    res.json({ id: testSetId, name });
  } catch (err) {
    await conn.rollback();
    console.error('Virhe luodessa tehtäväsettiä:', err);
    res.status(500).json({ error: 'Tietokanta virhe' });
  } finally {
    conn.release();
  }
  });

  router.get('/test-sets', async (req, res) => {
    //console.log('GET /api/exercises/test-sets hit');
    try {
      const [rows] = await db.promise().query('SELECT * FROM test_sets');
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: 'Tietokanta virhe' });
    }
  });

  router.get('/test-sets/:id', async (req, res) => {
    const testSetId = req.params.id;
    try {
      const [rows] = await db.promise().query(
        `SELECT e.* FROM exercises e
        JOIN test_set_exercises tse ON e.id = tse.exercise_id
        WHERE tse.test_set_id = ?`, [testSetId]
      );
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: 'Tietokanta virhe' });
    }
  });

  // haetaan kaikki tehtävät joista palautetaan id ja kuvaus
  router.get('/', async (req, res) => {
    try {
      const [rows] = await db.promise().query('SELECT id, description, class FROM exercises');
      res.json(rows);
    } catch (err) {
      console.error('Virhe haettaessa tehtäviä:', err);
      res.status(500).json({ error: 'Tietokanta virhe' });
    }
  });
  router.post('/',authenticateToken, isAdmin , async (req, res) => {
    const { description, expected_query, hint, class: exerciseClass } = req.body;

    if (!description || !expected_query || !exerciseClass) {
      return res.status(400).json({ error: 'Täytä kaikki kentät' });
    }

    try {
      const [result] = await db.promise().query(
        'INSERT INTO exercises (description, expected_query, hint, class) VALUES (?, ?, ?, ?)',
        [description, expected_query, hint || '', exerciseClass]
      );

      res.status(201).json({ id: result.insertId });
    } catch (err) {
      console.error('Virhe luodessa tallennettaessa tehtävää:', err);
      res.status(500).json({ error: 'Tietokanta virhe' });
    }
  });

  // Haetaan yksittäisen tehtävän tiedot 
  router.get('/:id', async (req, res) => {
    const exerciseId = req.params.id;
    try {
      const [rows] = await db.promise().query('SELECT * FROM exercises WHERE id = ?', [exerciseId]);
      if (rows.length === 0) {
        return res.status(404).json({ error: 'Tehtävää ei löytynyt' });
      }
      res.json(rows[0]);
    } catch (err) {
      console.error('Virhe haettaessa tehtävää:', err);
      res.status(500).json({ error: 'Tietokanta virhe' });
    }
  });

  // käyttäjän kirjoittama kysely ja tarkasta että se on SELECT
  router.post('/:id/evaluate', async (req, res) => {
    const exerciseId = req.params.id;
    const userQuery = req.body.query;


    if (!userQuery) {
      return res.status(400).json({ error: 'Tyhä kenttä' });
    }
    if (!isSelectQuery(userQuery)) {
      return res.status(400).json({ error: 'Vain SELECT sallittu' });
    }

    try {
      // Hae odotettu kysely
      const [exerciseRows] = await db.promise().query('SELECT expected_query, class FROM exercises WHERE id = ?', [exerciseId]);
      if (exerciseRows.length === 0) {
        return res.status(404).json({ error: 'Tehtävää ei löytynyt' });
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
      console.error('Virhe vertailussa:', err);
      res.status(500).json({ error: 'Tietokanta virhe' });
    }
  });

  return router;
};
