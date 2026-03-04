const express = require('express');
const router = express.Router();
const { Project } = require('../models');
const authenticateToken = require('../middleware/auth');

// Get all projects
router.get('/', async (req, res) => {
    try {
        const projects = await Project.findAll({ order: [['display_order', 'ASC']] });
        res.json(projects);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create project
router.post('/', authenticateToken, async (req, res) => {
    // Add auth middleware here if needed
    try {
        const { title, description, image_url, live_url, github_url, tech_stack, featured, display_order } = req.body;
        const project = await Project.create({
            title, description, image_url, live_url, github_url, tech_stack: tech_stack || [], featured: featured || false, display_order: display_order || 0
        });
        res.status(201).json(project);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update project
router.put('/:id', authenticateToken, async (req, res) => {
    try {
        const updates = req.body;
        const id = req.params.id;

        await Project.update(updates, { where: { id } });

        console.log(`Project ${id} updated with fields:`, Object.keys(updates).join(', '));
        res.json({ message: 'Project updated' });
    } catch (err) {
        console.error('Update project error:', err);
        res.status(500).json({ error: err.message });
    }
});

// Delete project
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        await Project.destroy({ where: { id: req.params.id } });
        res.json({ message: 'Project deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
