const express = require('express');
const router = express.Router();
const { Certificate } = require('../models');

router.get('/', async (req, res) => {
    try {
        const certs = await Certificate.findAll({ order: [['display_order', 'ASC']] });
        res.json(certs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const { title, issuer, issue_date, credential_url, image_url, display_order } = req.body;
        await Certificate.create({ title, issuer, issue_date, credential_url, image_url, display_order });
        res.status(201).json({ message: 'Certificate added' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const updates = req.body;
        const id = req.params.id;

        await Certificate.update(updates, { where: { id } });

        console.log(`Certificate ${id} updated with fields:`, Object.keys(updates).join(', '));
        res.json({ message: 'Certificate updated' });
    } catch (err) {
        console.error('Update certificate error:', err);
        res.status(500).json({ error: err.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await Certificate.destroy({ where: { id: req.params.id } });
        res.json({ message: 'Certificate deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
