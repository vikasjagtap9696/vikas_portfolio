const express = require('express');
const router = express.Router();
const { ContactSubmission } = require('../models');

// Submit contact form
router.post('/', async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;
        const submission = await ContactSubmission.create({ name, email, subject, message });
        res.status(201).json({ message: 'Message sent successfully', id: submission.id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get submissions (admin only usually)
router.get('/', async (req, res) => {
    try {
        const messages = await ContactSubmission.findAll({ order: [['created_at', 'DESC']] });
        res.json(messages);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Mark as read or delete
router.delete('/:id', async (req, res) => {
    try {
        await ContactSubmission.destroy({ where: { id: req.params.id } });
        res.json({ message: 'Message deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
