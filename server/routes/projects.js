const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all projects
router.get('/', async (req, res) => {
    try {
        const [projects] = await db.query('SELECT * FROM projects ORDER BY display_order ASC');
        res.json(projects);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create project
router.post('/', async (req, res) => {
    // Add auth middleware here if needed
    try {
        const { title, description, image_url, live_url, github_url, tech_stack, featured, display_order } = req.body;
        // tech_stack is expected to be an array, MySQL JSON column handles it if passed as JSON string or structure depending on driver
        // mysql2 handles automatic serialization if it is an object/array usually? Let's stringify to be safe for JSON column
        const techStackJson = JSON.stringify(tech_stack || []);

        const [result] = await db.query(
            'INSERT INTO projects (title, description, image_url, live_url, github_url, tech_stack, featured, display_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [title, description, image_url, live_url, github_url, techStackJson, featured || false, display_order || 0]
        );
        res.status(201).json({ id: result.insertId, ...req.body });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update project
router.put('/:id', async (req, res) => {
    try {
        const { title, description, image_url, live_url, github_url, tech_stack, featured, display_order } = req.body;
        const techStackJson = JSON.stringify(tech_stack || []);

        await db.query(
            'UPDATE projects SET title=?, description=?, image_url=?, live_url=?, github_url=?, tech_stack=?, featured=?, display_order=? WHERE id=?',
            [title, description, image_url, live_url, github_url, techStackJson, featured, display_order, req.params.id]
        );
        res.json({ message: 'Project updated' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete project
router.delete('/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM projects WHERE id = ?', [req.params.id]);
        res.json({ message: 'Project deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
