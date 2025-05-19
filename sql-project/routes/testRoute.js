const express = require('express');
const router = express.Router();

module.exports = (db) => {
  router.get('/', (req, res) => {
    db.query('select firstname from person;', (err, results) => {
      if (err) {
        console.error('Error fetching persons:', err);
        return res.status(500).json({ error: 'Database query failed' });
      }
      res.json(results);
    });
  });

  return router;
};
