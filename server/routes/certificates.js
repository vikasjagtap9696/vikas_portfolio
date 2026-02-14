const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
    try {
        const [certs] = await db.query('SELECT * FROM certificates ORDER BY display_order ASC');
        res.json(certs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const { title, issuer, issue_date, credential_url, image_url, display_order } = req.body;
        await db.query(
            `INSERT INTO certificates (title, issuer, issue_date, credential_url, image_url, display_order) 
            VALUES (?, ?, ?, ?, ?, ?)`,
            [title, issuer, issue_date, credential_url, image_url, display_order]
        );
        res.status(201).json({ message: 'Certificate added' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const { title, issuer, issue_date, credential_url, image_url, display_order } = req.body;
        await db.query(
            `UPDATE certificates SET title=?, issuer=?, issue_date=?, credential_url=?, image_url=?, display_order=? 
            WHERE id=?`,
            [title, issuer, issue_date, credential_url, image_url, display_order, req.params.id]
        );
        res.json({ message: 'Certificate updated' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM certificates WHERE id=?', [req.params.id]);
        res.json({ message: 'Certificate deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
