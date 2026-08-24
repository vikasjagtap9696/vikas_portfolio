const express = require('express');
const router = express.Router();
const { ResumeSetting } = require('../models');

// Get resume settings
router.get('/', async (req, res) => {
    try {
        const settings = await ResumeSetting.findOne();
        res.json(settings || {});
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update resume settings (mostly internally used after upload)
router.post('/', async (req, res) => {
    try {
        const { file_url, file_name } = req.body;
        const settings = await ResumeSetting.findOne();

        if (settings) {
            await settings.update({ file_url, file_name });
        } else {
            await ResumeSetting.create({ file_url, file_name });
        }
        res.json({ message: 'Resume updated' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
