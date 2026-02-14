const express = require('express');
const router = express.Router();
const db = require('../db');

// Submit contact form
router.post('/', async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;
        const [result] = await db.query(
            'INSERT INTO contact_submissions (name, email, subject, message) VALUES (?, ?, ?, ?)',
            [name, email, subject, message]
        );
        res.status(201).json({ message: 'Message sent successfully', id: result.insertId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get submissions (admin only usually)
router.get('/', async (req, res) => {
    try {
        const [messages] = await db.query('SELECT * FROM contact_submissions ORDER BY created_at DESC');
        res.json(messages);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Mark as read or delete
router.delete('/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM contact_submissions WHERE id = ?', [req.params.id]);
        res.json({ message: 'Message deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
