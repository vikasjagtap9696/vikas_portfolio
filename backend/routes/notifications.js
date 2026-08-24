const express = require('express');
const router = express.Router();
const { NotificationSetting } = require('../models');

// Get notification settings
router.get('/', async (req, res) => {
    try {
        const settings = await NotificationSetting.findOne();
        res.json(settings || null);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update or create notification settings
router.post('/', async (req, res) => {
    try {
        const { notification_email, send_confirmation_email } = req.body;
        const settings = await NotificationSetting.findOne();

        if (settings) {
            await settings.update({ notification_email, send_confirmation_email });
        } else {
            await NotificationSetting.create({ notification_email, send_confirmation_email });
        }
        res.json({ message: 'Settings saved successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
