const express = require('express');
const router = express.Router();
const db = require('../db');

// Get resume settings
router.get('/', async (req, res) => {
    try {
        const [settings] = await db.query('SELECT * FROM resume_settings LIMIT 1');
        res.json(settings[0] || {});
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update resume settings (mostly internally used after upload)
router.post('/', async (req, res) => {
    try {
        const { file_url, file_name } = req.body;
        const [existing] = await db.query('SELECT id FROM resume_settings LIMIT 1');

        if (existing.length > 0) {
            await db.query(
                `UPDATE resume_settings SET file_url=?, file_name=?, updated_at=NOW() WHERE id=?`,
                [file_url, file_name, existing[0].id]
            );
        } else {
            await db.query(
                `INSERT INTO resume_settings (file_url, file_name) VALUES (?, ?)`,
                [file_url, file_name]
            );
        }
        res.json({ message: 'Resume updated' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
