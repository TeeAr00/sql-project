const express = require('express');
const router = express.Router();

function isSelectQuery(query) {
  if (!query) return false;
  const trimmed = query.trim().toUpperCase();
  return trimmed.startsWith('SELECT');
}

module.exports = (db) => {
  router.get('/tables', async (req, res) => {
    try {
      const [hours] = await db.promise().query('SELECT * FROM hour');
      const [persons] = await db.promise().query('SELECT * FROM person');
      const [projects] = await db.promise().query('SELECT * FROM project');

      res.json({
        hour: hours,
        person: persons,
        project: projects
      });
    } catch (err) {
      console.error('Virhe haettaessa tietoja:', err);
      res.status(500).json({ error: 'Tietokantavirhe' });
    }
  });

  router.post('/query', async (req, res) => {
    const { query } = req.body;

    if (!query || !isSelectQuery(query)) {
      return res.status(400).json({ error: 'Vain SELECT komentoja' });
    }

    const allowedTables = ['hour', 'person', 'project'];
    const lowerQuery = query.toLowerCase();

    if (!allowedTables.some(t => lowerQuery.includes(t))) {
      return res.status(400).json({ error: 'Vain hakuja taulukoista hour, person ja project' });
    }

    try {
      const [rows] = await db.promise().query(query);
      res.json({ rows });
    } catch (err) {
      console.error('Kysely virhe:', err);
      res.status(500).json({ error: 'Kysely virhe' });
    }
  });

  return router;
};
