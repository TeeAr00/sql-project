const express = require('express');
const authenticateToken = require('../middleware/auth');

module.exports = (db2) => {
  const router = express.Router();

  router.get('/', authenticateToken, async (req, res) => {
    const userId = req.user.id;

    try {
      const [rows] = await db2.promise().query(
        'SELECT user_id, username, email FROM users WHERE user_id = ?',
        [userId]
      );

      if (rows.length === 0) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json(rows[0]);
    } catch (error) {
      console.error('Profile error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  return router;
};
