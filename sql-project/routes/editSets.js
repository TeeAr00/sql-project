const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');

module.exports = (db) => {
    router.get('/', authenticateToken, isAdmin, async (req, res) => {
    try {
        const [testSets] = await db.promise().query('SELECT * FROM test_sets');

        const setsWithExercises = await Promise.all(testSets.map(async (set) => {
        const [exercises] = await db.promise().query(
            `SELECT e.id, e.description, e.class 
            FROM exercises e
            JOIN test_set_exercises tse ON e.id = tse.exercise_id
            WHERE tse.test_set_id = ?`, 
            [set.id]
        );
        return {
            ...set,
            exercises
        };
        }));

        res.json(setsWithExercises);
    } catch (err) {
        console.error('Error fetching test sets with exercises:', err);
        res.status(500).json({ error: 'Database error' });
    }
    });
    

    router.delete('/:id', authenticateToken, isAdmin, async (req, res) => {
    const testSetId = req.params.id;

    const conn = await db.promise().getConnection();
    try {
        await conn.beginTransaction();
        await conn.query('DELETE FROM test_set_exercises WHERE test_set_id = ?', [testSetId]);
        const [result] = await conn.query('DELETE FROM test_sets WHERE id = ?', [testSetId]);
        await conn.commit();

        if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Test set not found' });
        }

        res.json({ message: 'Test set deleted successfully' });
    } catch (err) {
        await conn.rollback();
        console.error('Error deleting test set:', err);
        res.status(500).json({ error: 'Database error' });
    } finally {
        conn.release();
    }
    });
return router;
}