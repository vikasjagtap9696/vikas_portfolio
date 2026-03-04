const express = require('express');
const router = express.Router();
const { Skill } = require('../models');

// Get all skills
router.get('/', async (req, res) => {
    try {
        const skills = await Skill.findAll({ order: [['display_order', 'ASC']] });
        res.json(skills);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create skill
router.post('/', async (req, res) => {
    try {
        const { name, proficiency, category, icon, display_order } = req.body;
        const skill = await Skill.create({
            name, proficiency, category, icon, display_order: display_order || 0
        });
        res.status(201).json(skill);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update skill
router.put('/:id', async (req, res) => {
    try {
        const updates = req.body;
        const id = req.params.id;

        await Skill.update(updates, { where: { id } });

        console.log(`Skill ${id} updated with fields:`, Object.keys(updates).join(', '));
        res.json({ message: 'Skill updated' });
    } catch (err) {
        console.error('Update skill error:', err);
        res.status(500).json({ error: err.message });
    }
});

// Delete skill
router.delete('/:id', async (req, res) => {
    try {
        await Skill.destroy({ where: { id: req.params.id } });
        res.json({ message: 'Skill deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
