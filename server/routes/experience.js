const express = require('express');
const router = express.Router();
const { Experience } = require('../models');

router.get('/', async (req, res) => {
    try {
        const exps = await Experience.findAll({ order: [['display_order', 'ASC']] });
        res.json(exps);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const { company, title, location, period, description, technologies, is_current, type, display_order } = req.body;
        await Experience.create({
            company, title, location, period, description: description || [], technologies: technologies || [], is_current, type, display_order
        });
        res.status(201).json({ message: 'Experience added' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const updates = req.body;
        const id = req.params.id;

        await Experience.update(updates, { where: { id } });

        console.log(`Experience ${id} updated with fields:`, Object.keys(updates).join(', '));
        res.json({ message: 'Experience updated' });
    } catch (err) {
        console.error('Update experience error:', err);
        res.status(500).json({ error: err.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await Experience.destroy({ where: { id: req.params.id } });
        res.json({ message: 'Experience deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
