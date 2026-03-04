const express = require('express');
const router = express.Router();
const { ProfileSetting } = require('../models');

// Get profile settings
router.get('/', async (req, res) => {
    try {
        const profile = await ProfileSetting.findOne();
        res.json(profile || {});
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update profile (partial update support)
router.put('/', async (req, res) => {
    try {
        const updates = req.body;

        // Remove id from updates if it's there
        delete updates.id;

        const profile = await ProfileSetting.findOne();

        if (!profile) {
            // If no profile exists, create one with whatever data we have
            const newProfile = await ProfileSetting.create(updates);
            return res.json({ message: 'Profile created', id: newProfile.id });
        }

        // Perform partial update
        await profile.update(updates);

        console.log(`Profile ${profile.id} updated with fields:`, Object.keys(updates).join(', '));
        res.json({ message: 'Profile updated' });
    } catch (err) {
        console.error('Update profile error:', err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
