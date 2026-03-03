const express = require('express');
const router = express.Router();
const db = require('../db');

// Get profile settings
router.get('/', async (req, res) => {
    try {
        const [profiles] = await db.query('SELECT * FROM profile_settings LIMIT 1');
        res.json(profiles[0] || {});
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update profile (partial update support)
router.put('/', async (req, res) => {
    try {
        const updates = req.body;

        // Remove id from updates if it's there, as we don't want to update the PK
        delete updates.id;

        const [existing] = await db.query('SELECT id FROM profile_settings LIMIT 1');

        if (existing.length === 0) {
            // If no profile exists, create one with whatever data we have
            const [result] = await db.query('INSERT INTO profile_settings SET ?', [updates]);
            return res.json({ message: 'Profile created', id: result.insertId });
        }

        const id = existing[0].id;

        // Handle JSON fields
        if (updates.career_goals) updates.career_goals = JSON.stringify(updates.career_goals);
        if (updates.what_i_do) updates.what_i_do = JSON.stringify(updates.what_i_do);

        // Perform partial update
        await db.query('UPDATE profile_settings SET ? WHERE id = ?', [updates, id]);

        console.log(`Profile ${id} updated with fields:`, Object.keys(updates).join(', '));
        res.json({ message: 'Profile updated' });
    } catch (err) {
        console.error('Update profile error:', err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
