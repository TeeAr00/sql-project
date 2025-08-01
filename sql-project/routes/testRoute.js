const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth');

module.exports = (db) => {
  router.get('/', authenticateToken, (req, res) => {
    db.query('SELECT firstname FROM person;', (err, results) => {
      if (err) {
        console.error('Error fetching persons:', err);
        return res.status(500).json({ error: 'Database query failed' });
      }
      res.json(results);
    });
  });

  return router;
};
