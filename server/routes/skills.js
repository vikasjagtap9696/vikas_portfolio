const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all skills
router.get('/', async (req, res) => {
    try {
        const [skills] = await db.query('SELECT * FROM skills ORDER BY display_order ASC');
        res.json(skills);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create skill
router.post('/', async (req, res) => {
    try {
        const { name, proficiency, category, icon, display_order } = req.body;
        const [result] = await db.query(
            'INSERT INTO skills (name, proficiency, category, icon, display_order) VALUES (?, ?, ?, ?, ?)',
            [name, proficiency, category, icon, display_order || 0]
        );
        res.status(201).json({ id: result.insertId, ...req.body });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update skill
router.put('/:id', async (req, res) => {
    try {
        const { name, proficiency, category, icon, display_order } = req.body;
        await db.query(
            'UPDATE skills SET name=?, proficiency=?, category=?, icon=?, display_order=? WHERE id=?',
            [name, proficiency, category, icon, display_order, req.params.id]
        );
        res.json({ message: 'Skill updated' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete skill
router.delete('/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM skills WHERE id = ?', [req.params.id]);
        res.json({ message: 'Skill deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
