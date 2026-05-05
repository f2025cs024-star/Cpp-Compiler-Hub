const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const db = require('../models/db');

router.get('/profile', auth, (req, res) => {
    const user = db.prepare('SELECT id, username, email, avatar_url, plan, created_at FROM users WHERE id = ?').get(req.user.id);
    res.json(user);
});

module.exports = router;
