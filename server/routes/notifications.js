const express = require('express');
const router = express.Router();
const db = require('../db');

// Get notification settings
router.get('/', async (req, res) => {
    try {
        const [settings] = await db.query('SELECT * FROM notification_settings LIMIT 1');
        res.json(settings[0] || null);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update or create notification settings
router.post('/', async (req, res) => {
    try {
        const { notification_email, send_confirmation_email } = req.body;
        const [existing] = await db.query('SELECT id FROM notification_settings LIMIT 1');

        if (existing.length > 0) {
            await db.query(
                `UPDATE notification_settings SET notification_email=?, send_confirmation_email=? WHERE id=?`,
                [notification_email, send_confirmation_email, existing[0].id]
            );
        } else {
            await db.query(
                `INSERT INTO notification_settings (notification_email, send_confirmation_email) VALUES (?, ?)`,
                [notification_email, send_confirmation_email]
            );
        }
        res.json({ message: 'Settings saved successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
