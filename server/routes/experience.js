const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
    try {
        const [exps] = await db.query('SELECT * FROM experiences ORDER BY display_order ASC');
        res.json(exps);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const { company, title, location, period, description, technologies, is_current, type, display_order } = req.body;
        const descJson = JSON.stringify(description || []);
        const techJson = JSON.stringify(technologies || []);

        await db.query(
            `INSERT INTO experiences 
            (company, title, location, period, description, technologies, is_current, type, display_order) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [company, title, location, period, descJson, techJson, is_current, type, display_order]
        );
        res.status(201).json({ message: 'Experience added' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const { company, title, location, period, description, technologies, is_current, type, display_order } = req.body;
        const descJson = JSON.stringify(description || []);
        const techJson = JSON.stringify(technologies || []);

        await db.query(
            `UPDATE experiences SET 
            company=?, title=?, location=?, period=?, description=?, technologies=?, is_current=?, type=?, display_order=?
            WHERE id=?`,
            [company, title, location, period, descJson, techJson, is_current, type, display_order, req.params.id]
        );
        res.json({ message: 'Experience updated' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM experiences WHERE id=?', [req.params.id]);
        res.json({ message: 'Experience deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
