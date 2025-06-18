const express = require('express');
const authenticateToken = require('../middleware/auth');
const bcrypt = require('bcrypt');

module.exports = (db2) => {
  const router = express.Router();

  // Profiilin haku
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

  // Salasanan vahito
  router.put('/change-password', authenticateToken, async (req, res) => {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    try {
      const [rows] = await db2.promise().query(
        'SELECT password FROM users WHERE user_id = ?',
        [userId]
      );

      if (rows.length === 0) {
        return res.status(404).json({ message: 'User not found' });
      }

      const user = rows[0];
      const passwordMatch = await bcrypt.compare(currentPassword, user.password);
      if (!passwordMatch) {
        return res.status(403).json({ message: 'Current password is incorrect' });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await db2.promise().query(
        'UPDATE users SET password = ? WHERE user_id = ?',
        [hashedPassword, userId]
      );

      res.json({ message: 'Password updated successfully' });
    } catch (error) {
      console.error('Change password error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  // sähköpostin vaihto
  router.put('/change-email', authenticateToken, async (req, res) => {
    const userId = req.user.id;
    const { newEmail } = req.body;

    try {
      await db2.promise().query(
        'UPDATE users SET email = ? WHERE user_id = ?',
        [newEmail, userId]
      );

      res.json({ message: 'Email updated successfully' });
    } catch (error) {
      console.error('Change email error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  return router;
};
