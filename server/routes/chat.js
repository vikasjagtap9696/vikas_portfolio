const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const { messages } = req.body;
        const userMessage = messages[messages.length - 1].content;

        // Simple mock response for now
        const responseMessage = `I am a backend-powered assistant. You said: "${userMessage}". (AI integration is pending configuration)`;

        // Simulate streaming response format if needed, or just standard JSON
        // The frontend expects a stream, but we can simplify it to just standard JSON for this migration
        // or we can simulate SSE.

        // Let's implement SSE for compatibility if possible, or just change frontend to accept JSON.
        // Changing frontend is easier.

        res.json({ reply: responseMessage });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
