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
        console.error('Virhe haettaessa tehtäviä:', err);
        res.status(500).json({ error: 'Tietokanta virhe' });
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
        return res.status(404).json({ error: 'TEhtäväsettiä ei löytynyt' });
        }

        res.json({ message: 'TEhtävä setti poistettu' });
    } catch (err) {
        await conn.rollback();
        console.error('Virhe poistaessa settiä:', err);
        res.status(500).json({ error: 'Tietokanta virhe' });
    } finally {
        conn.release();
    }
    });
return router;
}