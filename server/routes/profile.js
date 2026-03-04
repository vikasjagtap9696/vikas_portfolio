const express = require('express');
const router = express.Router();
const { ProfileSetting } = require('../models');
const authenticateToken = require('../middleware/auth');

// Get profile settings
router.get('/', async (req, res) => {
    try {
        const profile = await ProfileSetting.findOne({ order: [['id', 'ASC']] });
        res.json(profile || {});
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update profile
router.put('/', authenticateToken, async (req, res) => {
    try {
        const updates = req.body;
        delete updates.id;

        let profile = await ProfileSetting.findOne({ order: [['id', 'ASC']] });

        if (!profile) {
            profile = await ProfileSetting.create(updates);
            console.log('New profile created');
        } else {
            await profile.update(updates);
            console.log(`Profile ${profile.id} updated successfully.`);
        }

        res.json({ message: 'Profile updated successfully', profile });
    } catch (err) {
        console.error('Update profile error:', err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
